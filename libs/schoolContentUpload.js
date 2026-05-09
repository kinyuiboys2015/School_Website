import cloudinary from "./cloudinary";

export const MAX_SCHOOL_IMAGE_SIZE = 3 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const isFileUpload = (file) =>
  file && typeof file === "object" && typeof file.arrayBuffer === "function" && file.size > 0;

export const validateSchoolImage = (file) => {
  if (!isFileUpload(file)) {
    return { valid: true };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      valid: false,
      error: "Invalid image format. Only JPEG, PNG, WebP, and GIF are allowed.",
    };
  }

  if (file.size > MAX_SCHOOL_IMAGE_SIZE) {
    return {
      valid: false,
      error: "Each department image must be less than 3 MB.",
    };
  }

  return { valid: true };
};

const sanitizeFileName = (name = "department-image") => {
  const dotIndex = name.lastIndexOf(".");
  const baseName = dotIndex > 0 ? name.substring(0, dotIndex) : name;
  return baseName.replace(/[^a-zA-Z0-9.-]/g, "_") || "department-image";
};

const uploadSchoolImage = async (file, folder) => {
  const validation = validateSchoolImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicId = `${Date.now()}-${sanitizeFileName(file.name)}`;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
        public_id: publicId,
        transformation: [
          { width: 1200, height: 800, crop: "fill" },
          { quality: "auto:good" },
        ],
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      }
    );

    stream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    altText: file.name,
    caption: null,
  };
};

export const uploadSchoolImagesFromFormData = async (formData, fieldName, folder) => {
  const files = formData.getAll(fieldName).filter(isFileUpload);
  const uploaded = [];

  for (const file of files) {
    uploaded.push(await uploadSchoolImage(file, folder));
  }

  return uploaded;
};

const publicIdFromCloudinaryUrl = (url) => {
  try {
    if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;

    const parsedUrl = new URL(url);
    const uploadPath = parsedUrl.pathname.split("/upload/")[1];
    if (!uploadPath) return null;

    return uploadPath.replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const normalizeImageForDelete = (image) => {
  if (!image) return null;
  if (typeof image === "string") return publicIdFromCloudinaryUrl(image);
  return image.publicId || publicIdFromCloudinaryUrl(image.url);
};

export const deleteSchoolImages = async (images) => {
  const list = Array.isArray(images) ? images : [images];
  const publicIds = list.map(normalizeImageForDelete).filter(Boolean);

  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (error) {
      console.warn("Could not delete Cloudinary image:", error.message);
    }
  }
};
