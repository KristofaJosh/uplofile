import { useMemo } from "react";

import type { TriggerRenderProps, UploadFileItem } from "./types";

export function computeTriggerStats<TMeta = any, TFileSource = unknown>(
  items: UploadFileItem<TMeta, TFileSource>[],
  isLoading: boolean,
  open: () => void,
): TriggerRenderProps<TMeta, TFileSource> {
  const uploading = items.filter((item) => item.status === "uploading");
  const uploadingCount = uploading.length;
  const doneCount = items.filter((item) => item.status === "done").length;
  const errorCount = items.filter((item) => item.status === "error").length;
  const totalProgress = uploadingCount
    ? Math.round(
        uploading.reduce(
          (acc, item) =>
            acc + (typeof item.progress === "number" ? item.progress : 0),
          0,
        ) / uploadingCount,
      )
    : undefined;

  return {
    items,
    isLoading,
    isUploading: uploadingCount > 0,
    uploadingCount,
    doneCount,
    errorCount,
    totalProgress,
    open,
  };
}

/**
 * Shared by web and native Trigger — keeps the render-prop stats computation
 * (and its memoisation) identical across platforms.
 */
export function useTriggerStats<TMeta = any, TFileSource = unknown>(
  items: UploadFileItem<TMeta, TFileSource>[],
  isLoading: boolean,
  open: () => void,
): TriggerRenderProps<TMeta, TFileSource> {
  return useMemo(
    () => computeTriggerStats(items, isLoading, open),
    [items, isLoading, open],
  );
}
