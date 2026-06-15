import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import {
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../libs/schoolContentUpload";
import {
  CBC_CATEGORY,
  CBC_PATHWAYS,
  VALID_CBC_PATHWAY_TYPES,
  VALID_STAFF_DEPARTMENT_CATEGORIES,
  isDepartmentLibraryImage,
  normalizeDepartmentCategory,
} from "../../../../libs/staffDepartmentConfig";
import {
  decorateDepartment,
  decorateDepartmentList,
  departmentInclude,
  loadDepartmentStaff,
  validateDepartmentHierarchyInput,
} from "../../../../libs/staffDepartmentServer";

// ==================== AUTHENTICATION UTILITIES ====================

class DeviceTokenManager {
  static validateTokensFromHeaders(headers) {
    try {
      const adminToken =
        headers.get("x-admin-token") ||
        headers.get("authorization")?.replace("Bearer ", "");
      const deviceToken = headers.get("x-device-token");

      if (!adminToken) {
        return {
          valid: false,
          reason: "no_admin_token",
          message: "Admin token is required",
        };
      }

      if (!deviceToken) {
        return {
          valid: false,
          reason: "no_device_token",
          message: "Device token is required",
        };
      }

      const adminParts = adminToken.split(".");
      if (adminParts.length !== 3) {
        return {
          valid: false,
          reason: "invalid_admin_token_format",
          message: "Invalid admin token format",
        };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return {
          valid: false,
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ""}`,
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));

        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return {
            valid: false,
            reason: "admin_token_expired",
            message: "Admin token has expired",
          };
        }

        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = [
          "ADMIN",
          "SUPER_ADMIN",
          "administrator",
          "PRINCIPAL",
          "STAFF",
          "HR_MANAGER",
        ];

        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return {
            valid: false,
            reason: "invalid_role",
            message: "User does not have permission to manage departments",
          };
        }
      } catch {
        return {
          valid: false,
          reason: "invalid_admin_token",
          message: "Invalid admin token",
        };
      }

      return {
        valid: true,
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole,
        },
        deviceInfo: deviceValid.payload,
      };
    } catch (error) {
      return {
        valid: false,
        reason: "validation_error",
        message: "Authentication validation failed",
        error: error.message,
      };
    }
  }

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, "base64").toString("utf-8");
      const payload = JSON.parse(payloadStr);

      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return {
          valid: false,
          reason: "expired",
          payload,
          error: "Device token has expired",
        };
      }

      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      if (createdAt < thirtyDaysAgo) {
        return {
          valid: false,
          reason: "age_expired",
          payload,
          error: "Device token is too old",
        };
      }

      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: "invalid_format", error: error.message };
    }
  }
}

const authenticateWriteRequest = (req) => {
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(req.headers);
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access Denied",
          message: "Authentication required to manage departments.",
          details: validationResult.message,
        },
        { status: 401 }
      ),
    };
  }
  return { authenticated: true, user: validationResult.user };
};

// ==================== ROUTE HANDLERS ====================

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const grouped = url.searchParams.get("grouped") === "1";
    const includeInactive = url.searchParams.get("includeInactive") === "1";
    const includeStaff =
      url.searchParams.get("includeStaff") === "1" ||
      url.searchParams.get("includeTeachers") === "1";

    // Only admins can include inactive records
    let adminOk = false;
    if (includeInactive) {
      const maybeAdminToken =
        req?.headers?.get("x-admin-token") ||
        req?.headers?.get("authorization")?.replace("Bearer ", "");
      const maybeDeviceToken = req?.headers?.get("x-device-token");

      if (maybeAdminToken && maybeDeviceToken) {
        const validation = DeviceTokenManager.validateTokensFromHeaders(req.headers);
        adminOk = validation.valid;
      }

      if (!adminOk) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }
    }

    const where = {};

    if (category) {
      const normalizedCategory = normalizeDepartmentCategory(category);
      if (!VALID_STAFF_DEPARTMENT_CATEGORIES.has(normalizedCategory)) {
        return NextResponse.json(
          { success: false, error: "Invalid department category" },
          { status: 400 }
        );
      }
      where.category = normalizedCategory;
    }

    if (!includeInactive) {
      where.isActive = true;
    }

    const departments = await prisma.staffDepartment.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: departmentInclude,
    });

    const allStaff = await loadDepartmentStaff(prisma, includeInactive);
    const {
      departments: cleanedDepartments,
      departmentHierarchy,
    } = decorateDepartmentList(departments, allStaff, includeStaff);

    if (!grouped) {
      return NextResponse.json({
        success: true,
        departments: cleanedDepartments,
        departmentHierarchy,
      });
    }

    const departmentsByCategory = cleanedDepartments.reduce((acc, dept) => {
      const key = dept.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(dept);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      departmentsByCategory,
      departments: cleanedDepartments,
      departmentHierarchy,
    });
  } catch (error) {
    console.error("❌ GET Departments Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const formData = await req.formData();

    const name = (formData.get("name") || "").toString().trim();
    const category = normalizeDepartmentCategory(formData.get("category") || "");
    const departmentType = (formData.get("departmentType") || "MAIN").toString();
    const parentDepartmentId = formData.get("parentDepartmentId");
    const departmentHeadIdRaw = formData.get("departmentHeadId");
    const description = (formData.get("description") || "").toString().trim();
    const headName = (formData.get("headName") || "").toString().trim();
    const pathwayHeadName = (formData.get("pathwayHeadName") || "").toString().trim();
    const cbePathwayType = (formData.get("cbePathwayType") || "").toString().trim();

    const staffCountRaw = formData.get("staffCount");
    const displayOrderRaw = formData.get("displayOrder");
    const isActiveRaw = formData.get("isActive");

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: "Department name and category are required" },
        { status: 400 }
      );
    }

    if (!VALID_STAFF_DEPARTMENT_CATEGORIES.has(category)) {
      return NextResponse.json(
        { success: false, error: "Invalid department category" },
        { status: 400 }
      );
    }

    let hierarchy;
    try {
      hierarchy = await validateDepartmentHierarchyInput(prisma, {
        departmentType,
        parentDepartmentId,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    let departmentHead = null;
    if (departmentHeadIdRaw !== null && departmentHeadIdRaw !== "") {
      const departmentHeadId = Number(departmentHeadIdRaw);
      if (!Number.isFinite(departmentHeadId)) {
        return NextResponse.json(
          { success: false, error: "Invalid department head selected" },
          { status: 400 }
        );
      }
      departmentHead = await prisma.staff.findUnique({
        where: { id: Math.floor(departmentHeadId) },
        select: { id: true, name: true },
      });
      if (!departmentHead) {
        return NextResponse.json(
          { success: false, error: "Selected department head was not found" },
          { status: 400 }
        );
      }
    }

    if (category === CBC_CATEGORY) {
      if (!VALID_CBC_PATHWAY_TYPES.has(cbePathwayType)) {
        return NextResponse.json(
          { success: false, error: "Select a valid CBC pathway" },
          { status: 400 }
        );
      }
      if (!departmentHead && !pathwayHeadName) {
        return NextResponse.json(
          { success: false, error: "Pathway head is required for CBC departments" },
          { status: 400 }
        );
      }
    }

    const staffCount = staffCountRaw !== null && staffCountRaw !== undefined && staffCountRaw !== ""
      ? Number(staffCountRaw)
      : 0;
    if (!Number.isFinite(staffCount) || staffCount < 0) {
      return NextResponse.json(
        { success: false, error: "staffCount must be a valid non-negative number" },
        { status: 400 }
      );
    }

    const displayOrder = displayOrderRaw !== null && displayOrderRaw !== undefined && displayOrderRaw !== ""
      ? Number(displayOrderRaw)
      : 0;
    if (!Number.isFinite(displayOrder)) {
      return NextResponse.json(
        { success: false, error: "displayOrder must be a valid number" },
        { status: 400 }
      );
    }

    const isActive =
      typeof isActiveRaw === "string"
        ? isActiveRaw === "true" || isActiveRaw === "1"
        : true;

    let extra = null;
    try {
      const extraStr = formData.get("extra");
      if (extraStr) extra = JSON.parse(extraStr);
    } catch {
      extra = null;
    }

    for (const file of [...formData.getAll("images"), formData.get("image")].filter(isFileUpload)) {
      const validation = validateSchoolImage(file);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }

    const uploadedImages = await uploadSchoolImagesFromFormData(formData, "images", "school_departments");
    const legacyImageFile = formData.get("image");
    if (isFileUpload(legacyImageFile)) {
      uploadedImages.push(...(await uploadSchoolImagesFromFormData(formData, "image", "school_departments")));
    }
    const imageUrl = (formData.get("imageUrl") || "").toString().trim();
    if (imageUrl && !isDepartmentLibraryImage(imageUrl)) {
      return NextResponse.json(
        { success: false, error: "Invalid department library image" },
        { status: 400 }
      );
    }

    const selectedImages = imageUrl
      ? [
          ...uploadedImages,
          {
            url: imageUrl,
            publicId: null,
            altText: name,
            caption: `${name} department`,
          },
        ]
      : uploadedImages;
    const primaryImage = uploadedImages[0]?.url || imageUrl || null;

    let cbePathwayId = null;
    if (category === CBC_CATEGORY) {
      const pathway = CBC_PATHWAYS.find((item) => item.type === cbePathwayType);
      const cbePathway = await prisma.cBEPathway.upsert({
        where: { type: pathway.type },
        update: {
          name: pathway.name,
          description: pathway.description,
          isActive: true,
        },
        create: {
          name: pathway.name,
          type: pathway.type,
          description: pathway.description,
          isActive: true,
        },
      });
      cbePathwayId = cbePathway.id;
    }

    const department = await prisma.staffDepartment.create({
      data: {
        name,
        departmentType: hierarchy.departmentType,
        parentDepartmentId: hierarchy.parentDepartmentId,
        departmentHeadId: departmentHead?.id || null,
        category,
        description: description || null,
        headName:
          category === CBC_CATEGORY ? null : departmentHead?.name || headName || null,
        pathwayHeadName:
          category === CBC_CATEGORY
            ? departmentHead?.name || pathwayHeadName || null
            : null,
        cbePathwayId,
        cbeTrackId: null,
        staffCount: Math.floor(staffCount),
        displayOrder: Math.floor(displayOrder),
        isActive,
        image: primaryImage,
        extra,
        images: selectedImages.length
          ? {
              create: selectedImages.map((image, index) => ({
                url: image.url,
                publicId: image.publicId,
                altText: image.altText || name,
                caption: image.caption || null,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: departmentInclude,
    });

    const allStaff = await loadDepartmentStaff(prisma, false);

    return NextResponse.json(
      {
        success: true,
        department: decorateDepartment(department, allStaff, false),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST Department Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create department" },
      { status: 500 }
    );
  }
}
