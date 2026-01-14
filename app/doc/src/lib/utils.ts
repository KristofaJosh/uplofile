import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UploadResult } from "uplofile";
import { FileArchive, FileIcon, FileImage, FileText } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock upload function for demos - simulates upload with progress
export const mockUpload = async (
  file: File,
  signal?: AbortSignal,
  setProgress?: (pct: number) => void,
  failChance: number = 0.05,
): Promise<UploadResult> => {
  return await new Promise((resolve, reject) => {
    let progress = 0;
    const shouldFail = Math.random() < failChance;

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

        if (shouldFail && progress > 70) {
          clearInterval(interval);
          reject(new Error("Mock upload failed (simulated error)"));
          return;
        }

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
            resolve({
              url: URL.createObjectURL(file),
              id: Math.random().toString(36).substring(2, 11),
            });
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

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}