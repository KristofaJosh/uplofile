import type { UploadResult } from "uplofile";

export function makeFakeUploader() {
  return async function upload(
    file: File,
    signal: AbortSignal,
    setProgress?: (pct: number) => void,
  ): Promise<UploadResult> {
    // Simulate progress for demo only
    if (setProgress) {
      let pct = 0;
      await new Promise<UploadResult>((resolve, reject) => {
        const id = setInterval(() => {
          pct += 10;
          setProgress(Math.min(pct, 95));
        }, 100);
        setTimeout(() => {
          clearInterval(id);
          resolve({ url: URL.createObjectURL(file) });
        }, 1200);
        signal.addEventListener("abort", () => {
          clearInterval(id);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
      return { url: URL.createObjectURL(file) };
    }
    return { url: URL.createObjectURL(file) };
  };
}
