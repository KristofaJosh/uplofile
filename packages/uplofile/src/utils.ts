export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

import { UploadFileItem } from "./types";

export const isVideoFile = (item: UploadFileItem): boolean => {
  if (item.file) {
    return item.file.type.startsWith("video/");
  }

  if (item.url) {
    const extension = item.url.split(".").pop()?.toLowerCase();
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
    if (extension && videoExtensions.includes(extension)) {
      return true;
    }
  }

  if (item.name) {
    const extension = item.name.split(".").pop()?.toLowerCase();
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
    if (extension && videoExtensions.includes(extension)) {
      return true;
    }
  }

  return false;
};
