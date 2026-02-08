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
