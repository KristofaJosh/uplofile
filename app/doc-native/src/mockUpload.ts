import type { UploadResult } from "uplofile/native";

export function mockUpload(
  file: any,
  signal: AbortSignal,
  setProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    let cancelled = false;

    const onAbort = () => {
      cancelled = true;
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal.addEventListener("abort", onAbort);

    let pct = 0;
    const interval = setInterval(() => {
      if (cancelled) return;

      pct += Math.random() * 20 + 5;
      if (pct > 100) pct = 100;
      setProgress?.(Math.round(pct));

      if (pct >= 100) {
        clearInterval(interval);
        signal.removeEventListener("abort", onAbort);
        resolve({
          url: file?.uri ?? "https://via.placeholder.com/300",
          id: file?.name ?? String(Date.now()),
        });
      }
    }, 400);
  });
}
