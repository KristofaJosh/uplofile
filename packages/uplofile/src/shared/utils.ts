import { UploadFileItem } from "./types";

/**
 * Generate a unique identifier for file items.
 * Combines a random string with a timestamp suffix for uniqueness.
 *
 * @returns A unique string identifier suitable for use as an item uid.
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
 *
 * @param path - The URL or file path to extract the extension from.
 * @returns The lowercase extension string, or undefined if no extension exists.
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
 * @returns True if the item is a video file.
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
 * @returns True if the item is an image file.
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

export const getValidAcceptTokens = (
  accept: string | undefined,
): string[] | undefined => {
  if (!accept || accept.trim() === "") return undefined;

  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return undefined;

  // Regex safety: anchored single-character-class check for MIME type/subtype tokens.
  // This avoids wildcard parsing with nested groups or backtracking-heavy patterns.
  const isMimePart = (part: string) => /^[a-z0-9!#$&^_.+-]+$/i.test(part);

  const validTokens = tokens.filter((token) => {
    if (token === "*/*") return true;

    if (token.endsWith("/*")) {
      return isMimePart(token.slice(0, -2));
    }

    if (token.includes("/")) {
      const [mimeType, mimeSubtype, ...rest] = token.split("/");
      return (
        !!mimeType &&
        !!mimeSubtype &&
        rest.length === 0 &&
        isMimePart(mimeType) &&
        isMimePart(mimeSubtype)
      );
    }

    return token.startsWith(".") && token.length > 1;
  });

  return validTokens.length > 0 ? validTokens : undefined;
};

export const getNativePickerAcceptTypes = (
  accept: string | undefined,
): string[] | undefined => {
  const tokens = getValidAcceptTokens(accept);
  if (!tokens) return undefined;

  return tokens.some((token) => token.startsWith("."))
    ? undefined
    : tokens;
};

/**
 * Check whether a File object matches the given HTML `accept` attribute value.
 * Supports MIME types (image/png), wildcards (image/*), and file extensions (.jpg).
 * Ignores malformed tokens and returns true when no valid tokens remain
 * (permissive behaviour matching `<input>`).
 *
 * @param file - The File object to check.
 * @param accept - The accept attribute string (comma-separated MIME types / extensions).
 * @returns True if the file matches any of the accept tokens.
 */
export const acceptsFile = (
  file: Pick<File, "name" | "type">,
  accept: string | undefined,
): boolean => {
  const tokens = getValidAcceptTokens(accept);
  if (!tokens) return true;

  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  const hasExt = (token: string) => {
    return token.length > 1 && name.endsWith(token);
  };

  return tokens.some((token) => {
    if (token === "*/*") {
      return true;
    }

    if (token.endsWith("/*")) {
      return type.startsWith(token.slice(0, -1));
    }

    if (token.includes("/")) {
      return type === token;
    }

    return hasExt(token);
  });
};
