export const humanizeValue = (value, fallback = "") => {
  const text = String(value || "").trim();
  if (!text) return fallback;

  return text
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const formatDisplayDate = (value, fallback = "Date not set") => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const getFileNameFromUrl = (url, fallback = "Download file") => {
  if (!url) return fallback;

  try {
    const pathname = new URL(url, "https://kinyuiboyssenior.school").pathname;
    const finalSegment = pathname.split("/").filter(Boolean).pop();
    return decodeURIComponent(finalSegment || fallback);
  } catch {
    return fallback;
  }
};

export const normalizeDownloadFile = (file, fallbackName = "Download file") => {
  if (!file) return null;

  if (typeof file === "string") {
    return {
      url: file,
      name: getFileNameFromUrl(file, fallbackName),
      type: "document",
    };
  }

  const url = file.url || file.secure_url || file.path;
  if (!url) return null;

  return {
    ...file,
    url,
    name: file.name || file.originalName || getFileNameFromUrl(url, fallbackName),
    type: file.fileType || file.type || "document",
  };
};
