"use client";

import {
  UplofileRoot,
  UplofileHiddenInput,
  UplofilePreview,
  UplofileTrigger,
} from "@/components/ui/uplofile.ts";
import { upload } from "@/utils/upload-simulator.ts";

export default function UploadExample() {
  return (
    <form className="max-w-md">
      <UplofileRoot multiple name="images" upload={upload}>
        <UplofileTrigger
          render={({ isUploading, totalProgress, items }) => (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"
              data-loading={isUploading || undefined}
            >
              {isUploading
                ? `Uploading ${totalProgress ?? 0}%`
                : "Select Images"}
              <span className="text-xs opacity-70">({items.length})</span>
            </button>
          )}
        />

        <UplofilePreview
          render={({ items, actions }) => (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.uid}
                  data-state={item.status}
                  className="relative rounded-lg border p-2"
                >
                  {item.previewUrl || item.url ? (
                    <img
                      src={item.previewUrl || item.url}
                      alt={item.name}
                      width={160}
                      height={120}
                      style={{ objectFit: "cover", width: "100%", height: 120 }}
                    />
                  ) : (
                    <div className="flex h-[120px] items-center justify-center text-xs opacity-70">
                      {item.name}
                    </div>
                  )}

                  {item.status === "uploading" && (
                    <div className="mt-2 h-1 bg-gray-200 dark:bg-neutral-800">
                      <div
                        className="h-full bg-black dark:bg-white"
                        style={{
                          width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                        }}
                      />
                    </div>
                  )}
                  {item.status === "error" && (
                    <div className="mt-1 text-xs text-red-600">
                      {item.error ?? "Upload failed"}
                    </div>
                  )}

                  <div className="mt-2 flex gap-2">
                    {item.status === "uploading" && (
                      <button
                        type="button"
                        onClick={() => actions.cancel(item.uid)}
                        className="text-xs underline"
                      >
                        Cancel
                      </button>
                    )}
                    {(item.status === "error" ||
                      item.status === "canceled") && (
                      <button
                        type="button"
                        onClick={() => actions.retry(item.uid)}
                        className="text-xs underline"
                      >
                        Retry
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => actions.remove(item.uid)}
                      className="text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        />

        <UplofileHiddenInput />
      </UplofileRoot>

      <div className="mt-6">
        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
