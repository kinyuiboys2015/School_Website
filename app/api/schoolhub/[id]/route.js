import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import {
  deleteSchoolImages,
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../libs/schoolContentUpload";

class DeviceTokenManager {
  static validateTokensFromHeaders(headers) {
    try {
      const adminToken =
        headers.get("x-admin-token") ||
        headers.get("authorization")?.replace("Bearer ", "");
      const deviceToken = headers.get("x-device-token");

      if (!adminToken) return { valid: false, message: "Admin token is required" };
      if (!deviceToken) return { valid: false, message: "Device token is required" };

      const adminParts = adminToken.split(".");
      if (adminParts.length !== 3) return { valid: false, message: "Invalid admin token format" };

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        if (adminPayload.exp < Date.now() / 1000) {
          return { valid: false, message: "Admin token has expired" };
        }

        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ["ADMIN", "SUPER_ADMIN", "administrator", "PRINCIPAL", "STAFF", "HR_MANAGER"];
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { valid: false, message: "User does not have permission to manage School Hub" };
        }
      } catch {
        return { valid: false, message: "Invalid admin token" };
      }

      try {
        const payload = JSON.parse(Buffer.from(deviceToken, "base64").toString("utf-8"));
        if (payload.exp && payload.exp * 1000 <= Date.now()) {
          return { valid: false, message: "Device token has expired" };
        }
      } catch {
        return { valid: false, message: "Invalid device token" };
      }

      return {
        valid: true,
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole,
        },
      };
    } catch (error) {
      return { valid: false, message: error.message || "Authentication validation failed" };
    }
  }
}

const VALID_TYPES = new Set([
  "CLUB",
  "SOCIETY",
  "STUDENT_COUNCIL",
  "COMPUTER_LAB",
  "FARM",
  "BOARDING",
  "SECURITY",
  "DEPARTMENT",
  "SPORTS",
  "ARTS",
  "SCIENCE",
  "TECHNOLOGY",
  "LEADERSHIP",
]);

const authenticateWriteRequest = (req) => {
  const validation = DeviceTokenManager.validateTokensFromHeaders(req.headers);
  if (!validation.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access Denied",
          message: "Authentication required to manage School Hub.",
          details: validation.message,
        },
        { status: 401 }
      ),
    };
  }
  return { authenticated: true, user: validation.user };
};

const parseJsonField = (value, fallback) => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseBoolean = (value, fallback = true) => {
  if (value === null || value === undefined || value === "") return fallback;
  return value === "true" || value === "1" || value === true;
};

const cleanHubItem = (item) => ({
  ...item,
  details: Array.isArray(item.details) ? item.details : parseJsonField(item.details, []),
  socialMedia:
    item.socialMedia && typeof item.socialMedia === "object" && !Array.isArray(item.socialMedia)
      ? item.socialMedia
      : parseJsonField(item.socialMedia, {}),
  images: Array.isArray(item.images) ? item.images : [],
});

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const item = await prisma.schoolHubItem.findUnique({
      where: { id },
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    if (!item || item.isActive === false) {
      return NextResponse.json({ success: false, error: "School Hub item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: cleanHubItem(item) });
  } catch (error) {
    console.error("❌ GET School Hub Item Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch School Hub item" },
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
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.schoolHubItem.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "School Hub item not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const data = {};

    if (formData.has("type")) {
      const type = formData.get("type").toString().trim();
      if (!VALID_TYPES.has(type)) throw new Error("Invalid School Hub type.");
      data.type = type;
    }

    if (formData.has("title")) {
      const title = formData.get("title").toString().trim();
      if (!title) throw new Error("Title is required.");
      data.title = title;
    }

    [
      "shortDescription",
      "description",
      "contactName",
      "contactPhone",
      "contactEmail",
      "location",
      "established",
      "website",
    ].forEach((field) => {
      if (formData.has(field)) data[field] = formData.get(field).toString().trim() || null;
    });

    if (formData.has("displayOrder")) {
      const displayOrder = Number(formData.get("displayOrder") || 0);
      data.displayOrder = Number.isFinite(displayOrder) ? Math.floor(displayOrder) : 0;
    }

    if (formData.has("isActive")) data.isActive = parseBoolean(formData.get("isActive"), true);
    if (formData.has("details")) data.details = parseJsonField(formData.get("details"), []);
    if (formData.has("socialMedia")) data.socialMedia = parseJsonField(formData.get("socialMedia"), {});

    for (const file of [...formData.getAll("images"), formData.get("image")].filter(isFileUpload)) {
      const validation = validateSchoolImage(file);
      if (!validation.valid) throw new Error(validation.error);
    }

    const imagesToRemove = formData.getAll("imagesToRemove").map((value) => value.toString());
    const matchingImagesToRemove = existing.images.filter((image) => imagesToRemove.includes(image.url));
    if (matchingImagesToRemove.length > 0) {
      await deleteSchoolImages(matchingImagesToRemove);
      await prisma.schoolHubImage.deleteMany({
        where: { id: { in: matchingImagesToRemove.map((image) => image.id) } },
      });
    }

    if (existing.image && imagesToRemove.includes(existing.image)) {
      await deleteSchoolImages(existing.image);
      data.image = null;
    }

    const uploadedImages = await uploadSchoolImagesFromFormData(formData, "images", "school_hub");
    const legacyImageFile = formData.get("image");
    if (isFileUpload(legacyImageFile)) {
      uploadedImages.push(...(await uploadSchoolImagesFromFormData(formData, "image", "school_hub")));
    } else if (typeof legacyImageFile === "string" && legacyImageFile.trim() !== "" && uploadedImages.length === 0) {
      data.image = legacyImageFile.trim();
    }

    if (uploadedImages.length > 0) {
      await prisma.schoolHubImage.createMany({
        data: uploadedImages.map((image, index) => ({
          schoolHubItemId: id,
          url: image.url,
          publicId: image.publicId,
          altText: image.altText || data.title || existing.title,
          caption: image.caption || null,
          displayOrder: existing.images.length + index,
        })),
      });
      data.image = data.image || uploadedImages[0].url;
    }

    const remainingImages = existing.images.filter(
      (image) => !matchingImagesToRemove.some((removed) => removed.id === image.id)
    );
    if (!data.image && (matchingImagesToRemove.length > 0 || uploadedImages.length > 0)) {
      data.image = remainingImages[0]?.url || uploadedImages[0]?.url || null;
    }

    const item = await prisma.schoolHubItem.update({
      where: { id },
      data,
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    return NextResponse.json({ success: true, item: cleanHubItem(item) });
  } catch (error) {
    console.error("❌ PUT School Hub Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update School Hub item" },
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
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.schoolHubItem.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "School Hub item not found" }, { status: 404 });
    }

    await prisma.schoolHubItem.delete({ where: { id } });
    await deleteSchoolImages([...(existing.images || []), existing.image].filter(Boolean));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE School Hub Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete School Hub item" },
      { status: 500 }
    );
  }
}
