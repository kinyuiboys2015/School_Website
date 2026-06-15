import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    return true;
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey =
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    return true;
  }

  return false;
}

export const isCloudinaryConfigured = configureCloudinary();

export const requireCloudinary = () => {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary configuration is missing. Set CLOUDINARY_URL or the Cloudinary cloud name, API key, and API secret."
    );
  }

  return cloudinary;
};

export default cloudinary;
