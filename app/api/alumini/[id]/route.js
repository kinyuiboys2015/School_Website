import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import {
  deleteSchoolImages,
  isFileUpload,
  uploadSchoolImagesFromFormData,
  validateSchoolImage,
} from "../../../../libs/schoolContentUpload";

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

const parseId = (value) => {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
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

const findAlumni = (id) =>
  prisma.alumni.findUnique({
    where: { id },
    include: {
      images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
    },
  });

export async function GET(_request, { params }) {
  try {
    const id = parseId(params.id);
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Valid alumni ID is required" },
        { status: 400 }
      );
    }

    const alumni = await findAlumni(id);
    if (!alumni || !alumni.isActive) {
      return NextResponse.json(
        { success: false, error: "Alumni record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, alumni: cleanAlumni(alumni) });
  } catch (error) {
    console.error("GET Alumni Record Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch alumni record" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = authenticateWriteRequest(request);
    if (!auth.authenticated) return auth.response;

    const id = parseId(params.id);
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Valid alumni ID is required" },
        { status: 400 }
      );
    }

    const existing = await findAlumni(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Alumni record not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const data = {};
    const title = getFormValue(formData, "title", "name");
    if (formData.has("title") || formData.has("name")) {
      if (!title) {
        return NextResponse.json(
          { success: false, error: "Alumni name or collection title is required" },
          { status: 400 }
        );
      }
      data.title = title;
    }

    if (formData.has("graduationYear")) {
      data.graduationYear = parseInteger(formData.get("graduationYear"));
    }
    if (formData.has("currentRole") || formData.has("profession")) {
      data.currentRole =
        getFormValue(formData, "currentRole", "profession") || null;
    }
    if (formData.has("organization")) {
      data.organization = getFormValue(formData, "organization") || null;
    }
    if (formData.has("location")) {
      data.location = getFormValue(formData, "location") || null;
    }
    if (
      formData.has("story") ||
      formData.has("description") ||
      formData.has("bio")
    ) {
      data.story = getFormValue(formData, "story", "description", "bio") || null;
    }
    if (formData.has("achievement") || formData.has("achievements")) {
      data.achievement =
        getFormValue(formData, "achievement", "achievements") || null;
    }
    if (formData.has("website") || formData.has("link")) {
      data.website = getFormValue(formData, "website", "link") || null;
    }
    if (formData.has("isFeatured")) {
      data.isFeatured = parseBoolean(formData.get("isFeatured"), false);
    }
    if (formData.has("isActive")) {
      data.isActive = parseBoolean(formData.get("isActive"), true);
    }
    if (formData.has("displayOrder")) {
      data.displayOrder = parseInteger(formData.get("displayOrder"), 0);
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

    const imageUrlsToRemove = formData
      .getAll("imagesToRemove")
      .map((value) => value.toString());
    const imagesToRemove = existing.images.filter((image) =>
      imageUrlsToRemove.includes(image.url)
    );
    if (imagesToRemove.length) {
      await deleteSchoolImages(imagesToRemove);
      await prisma.alumniImage.deleteMany({
        where: { id: { in: imagesToRemove.map((image) => image.id) } },
      });
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

    if (uploadedImages.length) {
      await prisma.alumniImage.createMany({
        data: uploadedImages.map((image, index) => ({
          alumniId: id,
          url: image.url,
          publicId: image.publicId,
          caption: image.caption || null,
          altText: image.altText || data.title || existing.title,
          displayOrder: existing.images.length + index,
        })),
      });
      data.image = uploadedImages[0].url;
    } else if (formData.has("image") && !isFileUpload(formData.get("image"))) {
      data.image = getFormValue(formData, "image") || null;
    }

    if (existing.image && imageUrlsToRemove.includes(existing.image) && !data.image) {
      const remainingImage = existing.images.find(
        (image) => !imageUrlsToRemove.includes(image.url)
      );
      data.image = remainingImage?.url || uploadedImages[0]?.url || null;
    }

    const alumni = await prisma.alumni.update({
      where: { id },
      data,
      include: {
        images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
      },
    });

    return NextResponse.json({ success: true, alumni: cleanAlumni(alumni) });
  } catch (error) {
    console.error("PUT Alumni Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update alumni record" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = authenticateWriteRequest(request);
    if (!auth.authenticated) return auth.response;

    const id = parseId(params.id);
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Valid alumni ID is required" },
        { status: 400 }
      );
    }

    const existing = await findAlumni(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Alumni record not found" },
        { status: 404 }
      );
    }

    await prisma.alumni.delete({ where: { id } });
    await deleteSchoolImages([
      ...existing.images,
      ...(existing.image ? [existing.image] : []),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Alumni Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete alumni record" },
      { status: 500 }
    );
  }
}
