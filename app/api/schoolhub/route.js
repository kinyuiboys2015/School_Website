import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import {
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../libs/schoolContentUpload";

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

const buildHubDataFromForm = async (formData, currentTitle = "") => {
  const type = (formData.get("type") || "").toString().trim();
  const title = (formData.get("title") || "").toString().trim();

  if (!type || !title) {
    throw new Error("Type and title are required.");
  }

  if (!VALID_TYPES.has(type)) {
    throw new Error("Invalid School Hub type.");
  }

  for (const file of [...formData.getAll("images"), formData.get("image")].filter(isFileUpload)) {
    const validation = validateSchoolImage(file);
    if (!validation.valid) throw new Error(validation.error);
  }

  const uploadedImages = await uploadSchoolImagesFromFormData(formData, "images", "school_hub");
  const legacyImageFile = formData.get("image");
  if (isFileUpload(legacyImageFile)) {
    uploadedImages.push(...(await uploadSchoolImagesFromFormData(formData, "image", "school_hub")));
  }

  const legacyImageUrl =
    typeof legacyImageFile === "string" && legacyImageFile.trim() ? legacyImageFile.trim() : null;

  const displayOrder = Number(formData.get("displayOrder") || 0);

  return {
    data: {
      type,
      title,
      shortDescription: (formData.get("shortDescription") || "").toString().trim() || null,
      description: (formData.get("description") || "").toString().trim() || null,
      contactName: (formData.get("contactName") || "").toString().trim() || null,
      contactPhone: (formData.get("contactPhone") || "").toString().trim() || null,
      contactEmail: (formData.get("contactEmail") || "").toString().trim() || null,
      displayOrder: Number.isFinite(displayOrder) ? Math.floor(displayOrder) : 0,
      isActive: parseBoolean(formData.get("isActive"), true),
      image: uploadedImages[0]?.url || legacyImageUrl || null,
      details: parseJsonField(formData.get("details"), []),
      location: (formData.get("location") || "").toString().trim() || null,
      established: (formData.get("established") || "").toString().trim() || null,
      website: (formData.get("website") || "").toString().trim() || null,
      socialMedia: parseJsonField(formData.get("socialMedia"), {}),
    },
    uploadedImages: uploadedImages.map((image, index) => ({
      url: image.url,
      publicId: image.publicId,
      altText: image.altText || title || currentTitle || "School Hub image",
      caption: image.caption || null,
      displayOrder: index,
    })),
  };
};

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const includeInactive = url.searchParams.get("includeInactive") === "1";

    if (type && !VALID_TYPES.has(type)) {
      return NextResponse.json({ success: false, error: "Invalid School Hub type" }, { status: 400 });
    }

    if (includeInactive) {
      const auth = authenticateWriteRequest(req);
      if (!auth.authenticated) return auth.response;
    }

    const where = {
      ...(type ? { type } : {}),
      ...(includeInactive ? {} : { isActive: true }),
    };

    const items = await prisma.schoolHubItem.findMany({
      where,
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    });

    const cleanedItems = items.map(cleanHubItem);
    const itemsByType = cleanedItems.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      items: cleanedItems,
      itemsByType,
      total: cleanedItems.length,
    });
  } catch (error) {
    console.error("❌ GET School Hub Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch School Hub items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const auth = authenticateWriteRequest(req);
    if (!auth.authenticated) return auth.response;

    const formData = await req.formData();
    const { data, uploadedImages } = await buildHubDataFromForm(formData);

    const item = await prisma.schoolHubItem.create({
      data: {
        ...data,
        images: uploadedImages.length ? { create: uploadedImages } : undefined,
      },
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    return NextResponse.json({ success: true, item: cleanHubItem(item) }, { status: 201 });
  } catch (error) {
    console.error("❌ POST School Hub Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create School Hub item" },
      { status: 500 }
    );
  }
}
