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
  normalizeDepartmentCategory,
} from "../../../../../libs/staffDepartmentConfig";

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

const teacherSelect = {
  id: true,
  name: true,
  role: true,
  position: true,
  department: true,
  departmentId: true,
  staffType: true,
  subjectOffered: true,
  bio: true,
  gender: true,
  status: true,
  image: true,
  joinDate: true,
  createdAt: true,
  updatedAt: true,
};

const cleanDepartmentResponse = (department) => {
  if (!department) return department;
  const teachers = Array.isArray(department.teachers) ? department.teachers : undefined;
  return {
    ...department,
    cbePathwayType: department.cbePathway?.type || null,
    pathwayName: department.cbePathway?.name || null,
    staffCount: teachers ? teachers.length : department.staffCount,
    teacherCount: teachers ? teachers.length : department.staffCount,
    teachers,
  };
};

const normalizeDepartmentName = (value = "") =>
  value.toString().trim().toLowerCase().replace(/\s+/g, " ");

const isVisibleTeacher = (teacher, includeInactive = false) => {
  if (includeInactive) return true;
  return (teacher?.status || "active").toString().trim().toLowerCase() !== "inactive";
};

const isTeacherRecord = (teacher) => {
  const role = (teacher?.role || "").toString().trim().toLowerCase();
  const staffType = (teacher?.staffType || "").toString().trim().toLowerCase();
  return role === "teacher" || staffType === "teacher";
};

const attachMappedTeachers = (department, allTeachers, includeInactive = false) => {
  const departmentName = normalizeDepartmentName(department.name);
  const relationTeachers = Array.isArray(department.teachers) ? department.teachers : [];
  const merged = [...relationTeachers];
  const seen = new Set(merged.map((teacher) => teacher.id));

  allTeachers.forEach((teacher) => {
    if (seen.has(teacher.id) || !isVisibleTeacher(teacher, includeInactive)) return;

    const matchesId = teacher.departmentId && Number(teacher.departmentId) === Number(department.id);
    const matchesName = normalizeDepartmentName(teacher.department) === departmentName;

    if (matchesId || matchesName) {
      merged.push(teacher);
      seen.add(teacher.id);
    }
  });

  merged.sort((a, b) => {
    const subjectCompare = (a.subjectOffered || "").localeCompare(b.subjectOffered || "");
    if (subjectCompare !== 0) return subjectCompare;
    return (a.name || "").localeCompare(b.name || "");
  });

  return { ...department, teachers: merged };
};

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }
    const url = new URL(req.url);
    const includeTeachers = url.searchParams.get("includeTeachers") === "1";
    const includeInactive = url.searchParams.get("includeInactive") === "1";

    const department = await prisma.staffDepartment.findUnique({
      where: { id },
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
        cbePathway: true,
        ...(includeTeachers
          ? {
              teachers: {
                where: includeInactive ? undefined : { status: "active" },
                select: teacherSelect,
                orderBy: [
                  { subjectOffered: "asc" },
                  { name: "asc" },
                ],
              },
            }
          : {}),
      },
    });
    if (!department) {
      return NextResponse.json({ success: false, error: "Department not found" }, { status: 404 });
    }

    const allTeachers = includeTeachers
      ? (await prisma.staff.findMany({
          select: teacherSelect,
          orderBy: [
            { subjectOffered: "asc" },
            { name: "asc" },
          ],
        })).filter((teacher) => isTeacherRecord(teacher) && isVisibleTeacher(teacher, includeInactive))
      : [];

    const departmentWithTeachers = includeTeachers
      ? attachMappedTeachers(department, allTeachers, includeInactive)
      : department;

    return NextResponse.json({ success: true, department: cleanDepartmentResponse(departmentWithTeachers) });
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
      include: { images: true, cbePathway: true },
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
    const nextCategory = normalizeDepartmentCategory(
      category !== null ? category : existing.category
    );

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
      if (!pathwayHeadName) {
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
      data.pathwayHeadName = pathwayHeadName;
      data.cbePathwayId = cbePathway.id;
      data.cbeTrackId = null;
    } else {
      if (!headName) {
        return NextResponse.json(
          { success: false, error: "Head of Department is required", authenticated: true },
          { status: 400 }
        );
      }
      data.headName = headName;
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
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
        cbePathway: true,
      },
    });

    return NextResponse.json({
      success: true,
      department: cleanDepartmentResponse(department),
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
      include: { images: true },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Department not found", authenticated: true },
        { status: 404 }
      );
    }

    await prisma.staffDepartment.delete({ where: { id } });

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
