import { useMemo } from "react";

import type { TriggerRenderProps, UploadFileItem } from "./types";

export function computeTriggerStats<TMeta = any, TFileSource = unknown>(
  items: UploadFileItem<TMeta, TFileSource>[],
  isLoading: boolean,
  open: () => void,
): TriggerRenderProps<TMeta, TFileSource> {
  let uploadingCount = 0;
  let doneCount = 0;
  let errorCount = 0;
  let progressSum = 0;

  for (const item of items) {
    switch (item.status) {
      case "uploading":
        uploadingCount++;
        progressSum += typeof item.progress === "number" ? item.progress : 0;
        break;
      case "done":
        doneCount++;
        if (item.error) errorCount++;
        break;
      case "error":
        errorCount++;
        break;
    }
  }

  const totalProgress = uploadingCount
    ? Math.round(progressSum / uploadingCount)
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
