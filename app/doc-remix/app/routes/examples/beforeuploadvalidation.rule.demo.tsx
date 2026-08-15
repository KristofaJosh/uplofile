import type { UploadFileItem } from "@/components/ui/uplofile";
import { type BeforeUploadFn } from "uplofile";

export const beforeUpload: BeforeUploadFn = async (items: UploadFileItem[]) => {
  return items.map((item) => {
    // Example: Reject files larger than 2MB
    if (item.file && item.file.size > 2 * 1024 * 1024) {
      return {
        uid: item.uid,
        valid: false,
        reason: "File too large (max 2MB)",
      };
    }

    // Example: Reject specific file names (e.g., restricted keywords)
    if (item.name.toLowerCase().includes("restricted")) {
      return {
        uid: item.uid,
        valid: false,
        reason: "File name contains restricted words",
      };
    }

    return { uid: item.uid, valid: true };
  });
};
