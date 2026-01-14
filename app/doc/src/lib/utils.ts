import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UploadResult } from "uplofile";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock upload function for demos - simulates upload with progress
export const mockUpload = async (file, signal, setProgress): Promise<UploadResult> => {
  return await new Promise((resolve, reject) => {
    let progress = 0;

    const onAbort = () => {
      clearInterval(interval);
      reject(new DOMException("Upload aborted", "AbortError"));
    };

    if (signal?.aborted) return onAbort();
    signal?.addEventListener("abort", onAbort, { once: true });

    const interval = setInterval(
      () => {
        if (signal?.aborted) return onAbort();
        const increment = Math.floor(Math.random() * 16) + 5; // 5 - 20
        progress += increment;
        if (typeof setProgress === "function") {
          try {
            setProgress(progress > 100 ? 100 : progress);
          } catch (_) {
            // ignore setProgress errors in demos
          }
        }
        if (progress >= 100) {
          clearInterval(interval);
          // Simulate a tiny delay after reaching 100%
          setTimeout(() => {
            resolve({ url: URL.createObjectURL(file) });
          }, 150);
        }
      },
      Math.floor(Math.random() * 701) + 300,
    ); // 300 - 1000 ms
  });
};

// Simulated remove handler that sometimes fails to demonstrate error states
export const mockOnRemove = async (item, signal) => {
  return await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => {
        // ~25% chance of failure to showcase strict/optimistic modes
        const failed = Math.random() < 0.25;
        if (failed) {
          reject(new Error("Server refused deletion (simulated)"));
        } else {
          resolve();
        }
      },
      Math.floor(Math.random() * 1200) + 600,
    );

    const onAbort = () => {
      clearTimeout(timeout);
      reject(new DOMException("Remove aborted", "AbortError"));
    };
    if (signal?.aborted) return onAbort();
    signal?.addEventListener("abort", onAbort, { once: true });
  });
};
