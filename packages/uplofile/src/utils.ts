export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

import { UploadFileItem } from "./types";

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
