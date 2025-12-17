import type { UploadFileItem, UploadResult } from "uplofile";

/**
 * Simulates uploading with variable progress and supports AbortSignal.
 */
export async function upload(
  file: File,
  signal: AbortSignal,
  setProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return await new Promise<UploadResult>((resolve, reject) => {
    let progress = 0;
    const tickMs = Math.floor(Math.random() * 400) + 150; // 150-550ms
    const id = setInterval(() => {
      progress += Math.floor(Math.random() * 16) + 5; // +5..+20
      if (setProgress) setProgress(Math.min(99, progress));
      if (progress >= 100) {
        clearInterval(id as any);
        resolve({ url: URL.createObjectURL(file) });
      }
    }, tickMs);

    const onAbort = () => {
      clearInterval(id as any);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Simulates server-side deletion with a small failure chance.
 * Useful to demonstrate `removeMode` strict vs optimistic.
 */
export async function onRemove(
  _item: UploadFileItem,
  signal: AbortSignal,
): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const ms = Math.floor(Math.random() * 800) + 400; // 400-1200ms
    const id = setTimeout(() => {
      // ~20% chance to fail
      if (Math.random() < 0.2) {
        reject(new Error("Server failed to delete."));
      } else {
        resolve();
      }
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
