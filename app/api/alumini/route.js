import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import {
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../libs/schoolContentUpload";

const decodeJwtPayload = (token) => {
  const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const paddedPayload = payload.padEnd(
    payload.length + ((4 - (payload.length % 4)) % 4),
    "="
  );

  return JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf-8"));
};

const authenticateWriteRequest = (request) => {
  try {
    const adminToken =
      request.headers.get("x-admin-token") ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    const deviceToken = request.headers.get("x-device-token");

    if (!adminToken || !deviceToken) {
      throw new Error("Admin and device tokens are required.");
    }

    const adminPayload = decodeJwtPayload(adminToken);
    if (adminPayload.exp && adminPayload.exp < Date.now() / 1000) {
      throw new Error("Admin token has expired.");
    }

    const role = String(adminPayload.role || adminPayload.userRole || "").toUpperCase();
    if (!["ADMIN", "SUPER_ADMIN", "ADMINISTRATOR", "PRINCIPAL", "STAFF"].includes(role)) {
      throw new Error("You do not have permission to manage alumni.");
    }

    const devicePayload = JSON.parse(
      Buffer.from(deviceToken, "base64").toString("utf-8")
    );
    if (devicePayload.exp && devicePayload.exp * 1000 <= Date.now()) {
      throw new Error("Device token has expired.");
    }

    return { authenticated: true };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access Denied",
          message: error.message || "Authentication required to manage alumni.",
        },
        { status: 401 }
      ),
    };
  }
};

const parseBoolean = (value, fallback = false) => {
  if (value === null || value === undefined || value === "") return fallback;
  return value === true || value === "true" || value === "1";
};

const parseInteger = (value, fallback = null) => {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : fallback;
};

const cleanAlumni = (alumni) => ({
  ...alumni,
  name: alumni.title,
  description: alumni.story,
  images: Array.isArray(alumni.images) ? alumni.images : [],
});

const getFormValue = (formData, ...fields) => {
  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null && value !== undefined && value.toString().trim()) {
      return value.toString().trim();
    }
  }
  return "";
};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get("includeInactive") === "1";
    const featured = url.searchParams.get("featured");
    const year = parseInteger(url.searchParams.get("year"));

    if (includeInactive) {
      const auth = authenticateWriteRequest(request);
      if (!auth.authenticated) return auth.response;
    }

    const where = {
      ...(includeInactive ? {} : { isActive: true }),
      ...(featured === "true" ? { isFeatured: true } : {}),
      ...(year ? { graduationYear: year } : {}),
    };

    const alumni = await prisma.alumni.findMany({
      where,
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    const cleanedAlumni = alumni.map(cleanAlumni);
    return NextResponse.json({
      success: true,
      alumni: cleanedAlumni,
      collections: cleanedAlumni,
      count: cleanedAlumni.length,
    });
  } catch (error) {
    console.error("GET Alumni Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alumni records" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = authenticateWriteRequest(request);
    if (!auth.authenticated) return auth.response;

    const formData = await request.formData();
    const title = getFormValue(formData, "title", "name");
    if (!title) {
      return NextResponse.json(
        { success: false, error: "Alumni name or collection title is required" },
        { status: 400 }
      );
    }

    const imageFiles = [
      ...formData.getAll("images"),
      formData.get("image"),
    ].filter(isFileUpload);
    for (const file of imageFiles) {
      const validation = validateSchoolImage(file);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }

    const uploadedImages = await uploadSchoolImagesFromFormData(
      formData,
      "images",
      "school/alumni"
    );
    if (isFileUpload(formData.get("image"))) {
      uploadedImages.unshift(
        ...(await uploadSchoolImagesFromFormData(
          formData,
          "image",
          "school/alumni"
        ))
      );
    }

    const imageUrl =
      uploadedImages[0]?.url ||
      (!isFileUpload(formData.get("image"))
        ? getFormValue(formData, "image")
        : "") ||
      null;
    const displayOrder = parseInteger(formData.get("displayOrder"), 0);

    const alumni = await prisma.alumni.create({
      data: {
        title,
        graduationYear: parseInteger(formData.get("graduationYear")),
        currentRole: getFormValue(formData, "currentRole", "profession") || null,
        organization: getFormValue(formData, "organization") || null,
        location: getFormValue(formData, "location") || null,
        story: getFormValue(formData, "story", "description", "bio") || null,
        achievement: getFormValue(formData, "achievement", "achievements") || null,
        website: getFormValue(formData, "website", "link") || null,
        image: imageUrl,
        isFeatured: parseBoolean(formData.get("isFeatured"), false),
        isActive: parseBoolean(formData.get("isActive"), true),
        displayOrder,
        images: uploadedImages.length
          ? {
              create: uploadedImages.map((image, index) => ({
                url: image.url,
                publicId: image.publicId,
                caption: image.caption || null,
                altText: image.altText || title,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    return NextResponse.json(
      { success: true, alumni: cleanAlumni(alumni) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Alumni Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create alumni record" },
      { status: 500 }
    );
  }
}
