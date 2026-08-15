import type { UploadFileItem } from "@/components/ui/uplofile";
import { clearMockResumableCheckpoint } from "@/lib/utils.ts";

export const clearCheckpointForItem = (item: UploadFileItem) => {
  if (!item.file) return;
  clearMockResumableCheckpoint(item.file);
};
