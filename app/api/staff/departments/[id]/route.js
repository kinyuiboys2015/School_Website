import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma";
import {
  deleteSchoolImages,
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../../libs/schoolContentUpload";
import {
  CBC_CATEGORY,
  CBC_PATHWAYS,
  VALID_CBC_PATHWAY_TYPES,
  VALID_STAFF_DEPARTMENT_CATEGORIES,
  isDepartmentLibraryImage,
  isSubDepartment,
  normalizeDepartmentCategory,
} from "../../../../../libs/staffDepartmentConfig";
import {
  decorateDepartment,
  departmentInclude,
  loadDepartmentStaff,
  syncDepartmentStaffCounts,
  validateDepartmentHierarchyInput,
} from "../../../../../libs/staffDepartmentServer";

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

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const url = new URL(req.url);
    const includeStaff =
      url.searchParams.get("includeStaff") === "1" ||
      url.searchParams.get("includeTeachers") === "1";
    const includeInactive = url.searchParams.get("includeInactive") === "1";

    const department = await prisma.staffDepartment.findUnique({
      where: { id },
      include: departmentInclude,
    });
    if (!department) {
      return NextResponse.json({ success: false, error: "Department not found" }, { status: 404 });
    }

    const [allStaff, childDepartments] = await Promise.all([
      loadDepartmentStaff(prisma, includeInactive),
      prisma.staffDepartment.findMany({
        where: {
          parentDepartmentId: id,
          ...(includeInactive ? {} : { isActive: true }),
        },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        include: departmentInclude,
      }),
    ]);
    const decoratedDepartment = decorateDepartment(
      department,
      allStaff,
      includeStaff
    );

    return NextResponse.json({
      success: true,
      department: {
        ...decoratedDepartment,
        subDepartments: childDepartments.map((child) =>
          decorateDepartment(child, allStaff, includeStaff)
        ),
      },
    });
  } catch (error) {
    console.error("❌ GET Department Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id", authenticated: true },
        { status: 400 }
      );
    }

    const existing = await prisma.staffDepartment.findUnique({
      where: { id },
      include: {
        images: true,
        cbePathway: true,
        subDepartments: { select: { id: true } },
      },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Department not found", authenticated: true },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const data = {};

    const name = formData.get("name");
    const category = formData.get("category");
    const departmentType = formData.has("departmentType")
      ? formData.get("departmentType")
      : existing.departmentType;
    const parentDepartmentId = formData.has("parentDepartmentId")
      ? formData.get("parentDepartmentId")
      : existing.parentDepartmentId;
    const nextCategory = normalizeDepartmentCategory(
      category !== null ? category : existing.category
    );

    let hierarchy;
    try {
      hierarchy = await validateDepartmentHierarchyInput(prisma, {
        departmentType,
        parentDepartmentId,
        currentDepartmentId: id,
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message, authenticated: true },
        { status: 400 }
      );
    }

    if (
      isSubDepartment(hierarchy.departmentType) &&
      existing.subDepartments.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Move or delete this department's sub-departments before converting it to a sub-department.",
          authenticated: true,
        },
        { status: 400 }
      );
    }

    data.departmentType = hierarchy.departmentType;
    data.parentDepartmentId = hierarchy.parentDepartmentId;

    if (name !== null) {
      const trimmed = name.toString().trim();
      if (!trimmed) {
        return NextResponse.json(
          { success: false, error: "Department name cannot be empty", authenticated: true },
          { status: 400 }
        );
      }
      data.name = trimmed;
    }

    if (category !== null) {
      if (!VALID_STAFF_DEPARTMENT_CATEGORIES.has(nextCategory)) {
        return NextResponse.json(
          { success: false, error: "Invalid department category", authenticated: true },
          { status: 400 }
        );
      }
      data.category = nextCategory;
    }

    const description = formData.get("description");
    if (description !== null) data.description = description.toString().trim() || null;

    let selectedDepartmentHead = null;
    if (formData.has("departmentHeadId")) {
      const departmentHeadIdRaw = formData.get("departmentHeadId");
      if (departmentHeadIdRaw === null || departmentHeadIdRaw === "") {
        data.departmentHeadId = null;
      } else {
        const departmentHeadId = Number(departmentHeadIdRaw);
        if (!Number.isFinite(departmentHeadId)) {
          return NextResponse.json(
            { success: false, error: "Invalid department head selected", authenticated: true },
            { status: 400 }
          );
        }
        selectedDepartmentHead = await prisma.staff.findUnique({
          where: { id: Math.floor(departmentHeadId) },
          select: { id: true, name: true },
        });
        if (!selectedDepartmentHead) {
          return NextResponse.json(
            { success: false, error: "Selected department head was not found", authenticated: true },
            { status: 400 }
          );
        }
        data.departmentHeadId = selectedDepartmentHead.id;
      }
    } else if (existing.departmentHeadId) {
      selectedDepartmentHead = await prisma.staff.findUnique({
        where: { id: existing.departmentHeadId },
        select: { id: true, name: true },
      });
    }

    const headName = (
      formData.has("headName") ? formData.get("headName") : existing.headName
    )?.toString().trim() || "";
    const pathwayHeadName = (
      formData.has("pathwayHeadName")
        ? formData.get("pathwayHeadName")
        : existing.pathwayHeadName
    )?.toString().trim() || "";
    const cbePathwayType = (
      formData.has("cbePathwayType")
        ? formData.get("cbePathwayType")
        : existing.cbePathway?.type
    )?.toString().trim() || "";

    if (nextCategory === CBC_CATEGORY) {
      if (!VALID_CBC_PATHWAY_TYPES.has(cbePathwayType)) {
        return NextResponse.json(
          { success: false, error: "Select a valid CBC pathway", authenticated: true },
          { status: 400 }
        );
      }
      if (!selectedDepartmentHead && !pathwayHeadName) {
        return NextResponse.json(
          { success: false, error: "Pathway head is required for CBC departments", authenticated: true },
          { status: 400 }
        );
      }

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
      data.headName = null;
      data.pathwayHeadName =
        selectedDepartmentHead?.name || pathwayHeadName || null;
      data.cbePathwayId = cbePathway.id;
      data.cbeTrackId = null;
    } else {
      data.headName = selectedDepartmentHead?.name || headName || null;
      data.pathwayHeadName = null;
      data.cbePathwayId = null;
      data.cbeTrackId = null;
    }

    const staffCountRaw = formData.get("staffCount");
    if (staffCountRaw !== null) {
      const staffCount = staffCountRaw === "" ? 0 : Number(staffCountRaw);
      if (!Number.isFinite(staffCount) || staffCount < 0) {
        return NextResponse.json(
          { success: false, error: "staffCount must be a valid non-negative number", authenticated: true },
          { status: 400 }
        );
      }
      data.staffCount = Math.floor(staffCount);
    }

    const displayOrderRaw = formData.get("displayOrder");
    if (displayOrderRaw !== null) {
      const displayOrder = displayOrderRaw === "" ? 0 : Number(displayOrderRaw);
      if (!Number.isFinite(displayOrder)) {
        return NextResponse.json(
          { success: false, error: "displayOrder must be a valid number", authenticated: true },
          { status: 400 }
        );
      }
      data.displayOrder = Math.floor(displayOrder);
    }

    const isActiveRaw = formData.get("isActive");
    if (isActiveRaw !== null) {
      data.isActive = isActiveRaw === "true" || isActiveRaw === "1";
    }

    const extraStr = formData.get("extra");
    if (extraStr !== null) {
      try {
        data.extra = extraStr ? JSON.parse(extraStr) : null;
      } catch {
        data.extra = null;
      }
    }

    for (const file of [...formData.getAll("images"), formData.get("image")].filter(isFileUpload)) {
      const validation = validateSchoolImage(file);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error, authenticated: true },
          { status: 400 }
        );
      }
    }

    let imagesChanged = false;
    const imagesToRemove = formData.getAll("imagesToRemove").map((value) => value.toString());
    const matchingImagesToRemove = existing.images.filter((image) => imagesToRemove.includes(image.url));
    if (matchingImagesToRemove.length > 0) {
      imagesChanged = true;
      await deleteSchoolImages(matchingImagesToRemove);
      await prisma.staffDepartmentImage.deleteMany({
        where: { id: { in: matchingImagesToRemove.map((image) => image.id) } },
      });
    }

    if (existing.image && imagesToRemove.includes(existing.image)) {
      imagesChanged = true;
      data.image = null;
      await deleteSchoolImages(existing.image);
    }

    const legacyImageFile = formData.get("image");
    const uploadedImages = await uploadSchoolImagesFromFormData(formData, "images", "school_departments");
    if (isFileUpload(legacyImageFile)) {
      uploadedImages.push(...(await uploadSchoolImagesFromFormData(formData, "image", "school_departments")));
    } else if (typeof legacyImageFile === "string" && legacyImageFile.trim() !== "" && uploadedImages.length === 0) {
      data.image = legacyImageFile.trim();
    }

    const imageUrl = (formData.get("imageUrl") || "").toString().trim();
    if (imageUrl && !isDepartmentLibraryImage(imageUrl)) {
      return NextResponse.json(
        { success: false, error: "Invalid department library image", authenticated: true },
        { status: 400 }
      );
    }

    if (imageUrl && !existing.images.some((image) => image.url === imageUrl)) {
      await prisma.staffDepartmentImage.create({
        data: {
          staffDepartmentId: id,
          url: imageUrl,
          altText: data.name || existing.name,
          caption: `${data.name || existing.name} department`,
          displayOrder: existing.images.length + uploadedImages.length,
        },
      });
      imagesChanged = true;
      if (!uploadedImages.length) data.image = imageUrl;
    }

    if (uploadedImages.length > 0) {
      imagesChanged = true;
      await prisma.staffDepartmentImage.createMany({
        data: uploadedImages.map((image, index) => ({
          staffDepartmentId: id,
          url: image.url,
          publicId: image.publicId,
          altText: image.altText || data.name || existing.name,
          caption: image.caption || null,
          displayOrder: existing.images.length + index,
        })),
      });
      data.image = uploadedImages[0].url;
    }

    const remainingImages = existing.images.filter(
      (image) => !matchingImagesToRemove.some((removed) => removed.id === image.id)
    );
    if (imagesChanged && !data.image) {
      data.image = remainingImages[0]?.url || uploadedImages[0]?.url || null;
    }

    const department = await prisma.staffDepartment.update({
      where: { id },
      data,
      include: departmentInclude,
    });

    const nextName = department.name;
    if (isSubDepartment(department)) {
      await prisma.staff.updateMany({
        where: {
          AND: [
            {
              OR: [
                { subDepartmentId: id },
                { mainDepartmentId: id },
                { departmentId: id },
              ],
            },
            {
              NOT: {
                OR: [{ role: "Teacher" }, { staffType: "Teacher" }],
              },
            },
          ],
        },
        data: {
          mainDepartmentId: department.parentDepartmentId,
          subDepartmentId: id,
          departmentId: id,
          department: nextName,
        },
      });
    } else {
      await prisma.staff.updateMany({
        where: {
          AND: [
            { OR: [{ subDepartmentId: id }, { departmentId: id }] },
            {
              NOT: {
                OR: [{ role: "Teacher" }, { staffType: "Teacher" }],
              },
            },
          ],
        },
        data: {
          mainDepartmentId: id,
          subDepartmentId: null,
          departmentId: id,
          department: nextName,
        },
      });
    }

    await syncDepartmentStaffCounts(prisma, [
      id,
      existing.parentDepartmentId,
      department.parentDepartmentId,
    ]);
    const allStaff = await loadDepartmentStaff(prisma, false);

    return NextResponse.json({
      success: true,
      department: decorateDepartment(department, allStaff, false),
    });
  } catch (error) {
    console.error("❌ PUT Department Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update department", authenticated: true },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid id", authenticated: true },
        { status: 400 }
      );
    }

    const existing = await prisma.staffDepartment.findUnique({
      where: { id },
      include: {
        images: true,
        subDepartments: { select: { id: true, name: true } },
      },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Department not found", authenticated: true },
        { status: 404 }
      );
    }

    if (existing.subDepartments.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Move or delete this department's sub-departments first.",
          authenticated: true,
        },
        { status: 409 }
      );
    }

    if (isSubDepartment(existing) && existing.parentDepartmentId) {
      const parentDepartment = await prisma.staffDepartment.findUnique({
        where: { id: existing.parentDepartmentId },
        select: { id: true, name: true },
      });

      await prisma.staff.updateMany({
        where: {
          AND: [
            {
              OR: [
                { subDepartmentId: id },
                { departmentId: id },
              ],
            },
            {
              NOT: {
                OR: [{ role: "Teacher" }, { staffType: "Teacher" }],
              },
            },
          ],
        },
        data: {
          mainDepartmentId: parentDepartment?.id || null,
          subDepartmentId: null,
          departmentId: parentDepartment?.id || null,
          department: parentDepartment?.name || null,
        },
      });
    } else {
      await prisma.staff.updateMany({
        where: {
          AND: [
            {
              OR: [
                { mainDepartmentId: id },
                { subDepartmentId: id },
                { departmentId: id },
              ],
            },
            {
              NOT: {
                OR: [{ role: "Teacher" }, { staffType: "Teacher" }],
              },
            },
          ],
        },
        data: {
          mainDepartmentId: null,
          subDepartmentId: null,
          departmentId: null,
          department: null,
        },
      });
    }

    await prisma.staffDepartment.delete({ where: { id } });
    await syncDepartmentStaffCounts(prisma, [existing.parentDepartmentId]);

    await deleteSchoolImages([...(existing.images || []), existing.image].filter(Boolean));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE Department Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete department", authenticated: true },
      { status: 500 }
    );
  }
}
