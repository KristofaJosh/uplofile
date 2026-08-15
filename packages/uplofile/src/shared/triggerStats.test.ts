import { describe, expect, it, vi } from "vitest";

import { computeTriggerStats } from "./triggerStats";
import type { UploadFileItem } from "./types";

describe("computeTriggerStats", () => {
  it("returns zeroed stats for an empty item list", () => {
    const open = vi.fn();
    const stats = computeTriggerStats([], false, open);

    expect(stats).toEqual({
      items: [],
      isLoading: false,
      isUploading: false,
      uploadingCount: 0,
      doneCount: 0,
      errorCount: 0,
      totalProgress: undefined,
      open,
    });
  });

  it("counts items by status and averages progress across uploading items", () => {
    const open = vi.fn();
    const items: UploadFileItem[] = [
      { uid: "1", name: "a.jpg", status: "uploading", progress: 20 },
      { uid: "2", name: "b.jpg", status: "uploading", progress: 60 },
      { uid: "3", name: "c.jpg", status: "done" },
      { uid: "4", name: "d.jpg", status: "error" },
      { uid: "5", name: "e.jpg", status: "canceled" },
    ];

    const stats = computeTriggerStats(items, true, open);

    expect(stats.isUploading).toBe(true);
    expect(stats.uploadingCount).toBe(2);
    expect(stats.doneCount).toBe(1);
    expect(stats.errorCount).toBe(1);
    expect(stats.totalProgress).toBe(40);
    expect(stats.isLoading).toBe(true);
    expect(stats.open).toBe(open);
  });

  it("treats missing progress values as 0 when averaging", () => {
    const items: UploadFileItem[] = [
      { uid: "1", name: "a.jpg", status: "uploading" },
      { uid: "2", name: "b.jpg", status: "uploading", progress: 50 },
    ];

    const stats = computeTriggerStats(items, false, vi.fn());

    expect(stats.totalProgress).toBe(25);
  });

  it("works with a native-shaped file source (no DOM File involved)", () => {
    type NativeFile = { uri: string; name: string | null; type: string | null };
    const items: UploadFileItem<any, NativeFile>[] = [
      {
        uid: "1",
        name: "doc.pdf",
        status: "uploading",
        progress: 10,
        file: {
          uri: "file:///doc.pdf",
          name: "doc.pdf",
          type: "application/pdf",
        },
      },
    ];

    const stats = computeTriggerStats(items, false, vi.fn());

    expect(stats.uploadingCount).toBe(1);
    expect(stats.totalProgress).toBe(10);
  });
});
