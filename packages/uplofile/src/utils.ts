import { UploadFileItem } from "./types";

/**
 * Generate a unique identifier for file items.
 * Combines a random string with a timestamp suffix for uniqueness.
 */
export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const VIDEO_EXTENSIONS = [
  "mp4",
  "webm",
  "ogg",
  "mov",
  "avi",
  "mkv",
  "wmv",
  "flv",
  "3gp",
  "m4v",
  "mpg",
  "mpeg",
];

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "avif",
  "bmp",
  "ico",
  "tiff",
];

/**
 * Extract the file extension from a URL or path string.
 * Returns the extension in lowercase, or undefined if none found.
 */
export const getExtension = (path: string) => {
  try {
    const url = new URL(path, "http://localhost");
    const pathname = url.pathname;
    const parts = pathname.split(".");
    if (parts.length > 1) return parts.pop()?.toLowerCase();
    return undefined;
  } catch {
    const parts = path.split("?")[0].split("#")[0].split(".");
    if (parts.length > 1) return parts.pop()?.toLowerCase();
    return undefined;
  }
};

/**
 * Check whether a file item represents a video.
 * Uses MIME type when available, otherwise falls back to extension detection.
 *
 * @param item - The file item to check.
 * @param extraExtensions - Additional video extensions to recognise.
 */
export const isVideoFile = (
  item: UploadFileItem<any>,
  extraExtensions: string[] = [],
): boolean => {
  if (item.file) {
    return item.file.type.startsWith("video/");
  }

  const allExtensions = [...VIDEO_EXTENSIONS, ...extraExtensions];

  if (item.url) {
    const extension = getExtension(item.url);
    if (extension && allExtensions.includes(extension)) {
      return true;
    }
  }

  if (item.name) {
    const extension = getExtension(item.name);
    if (extension && allExtensions.includes(extension)) {
      return true;
    }
  }

  return false;
};

/**
 * Check whether a file item represents an image.
 * Uses MIME type when available, otherwise falls back to extension detection.
 *
 * @param item - The file item to check.
 * @param extraExtensions - Additional image extensions to recognise.
 */
export const isImageFile = (
  item: UploadFileItem<any>,
  extraExtensions: string[] = [],
): boolean => {
  if (item.file) {
    return item.file.type.startsWith("image/");
  }

  const allExtensions = [...IMAGE_EXTENSIONS, ...extraExtensions];

  if (item.url) {
    const extension = getExtension(item.url);
    if (extension && allExtensions.includes(extension)) {
      return true;
    }
  }

  if (item.name) {
    const extension = getExtension(item.name);
    if (extension && allExtensions.includes(extension)) {
      return true;
    }
  }

  return false;
};

/**
 * Check whether a File object matches the given HTML `accept` attribute value.
 * Supports MIME types (image/png), wildcards (image/*), and file extensions (.jpg, jpg).
 * Returns true when accept is empty or malformed (permissive behaviour matching `<input>`).
 */
export const acceptsFile = (
  file: File,
  accept: string | undefined,
): boolean => {
  if (!accept || accept.trim() === "") return true;
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  // If accept is malformed, be permissive (browser file input also ignores)
  if (tokens.length === 0) return true;

  // Helper: match extension token like .jpg or jpg
  const hasExt = (token: string) => {
    const extToken = token.startsWith(".") ? token.slice(1) : token;
    const fileExt = name.includes(".") ? name.split(".").pop() : undefined;
    return !!fileExt && fileExt === extToken;
  };

  // Check any token matches
  return tokens.some((token) => {
    if (token === "*/*") return true;

    // MIME type with wildcard, e.g., image/*
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1); // keep the slash
      return type.startsWith(prefix);
    }

    // Full MIME type e.g., image/png
    if (token.includes("/")) return type === token;

    // File extensions, with or without a leading dot
    return hasExt(token);
  });
};
