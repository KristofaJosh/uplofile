import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/file-uploader";
import { upload, onRemove } from "@/utils/upload-simulator";

export default function ProductModeration() {
  return (
    <UplofileRoot
      upload={upload}
      onRemove={onRemove}
      removeMode="strict"
      name="product-images"
      accept="image/*"
    >
      <UplofileTrigger className="rounded-lg border px-3 py-2">
        Upload product photos
      </UplofileTrigger>

      <UplofilePreview
        render={({ items, actions }) => (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.uid} className="rounded-lg border p-2">
                {item.url || item.previewUrl ? (
                  <img
                    className="h-28 w-full rounded object-cover"
                    src={item.url || item.previewUrl}
                    alt={item.name}
                  />
                ) : (
                  <div className="flex h-28 items-center justify-center text-xs opacity-70">
                    {item.name}
                  </div>
                )}
                {item.status === "uploading" && (
                  <div className="mt-2 h-1 bg-gray-200">
                    <div
                      className="h-full bg-black"
                      style={{
                        width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                      }}
                    />
                  </div>
                )}
                {item.status === "removing" && (
                  <div className="mt-1 text-xs opacity-70">Deleting…</div>
                )}
                {item.status === "error" && (
                  <div className="mt-1 text-xs text-red-600">
                    {item.error ?? "Operation failed"}
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  {item.status === "uploading" ? (
                    <button
                      type="button"
                      onClick={() => actions.cancel(item.uid)}
                      className="text-xs underline"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => actions.remove(item.uid)}
                      className="text-xs underline"
                      disabled={item.status === "removing"}
                    >
                      Remove
                    </button>
                  )}
                  {(item.status === "error" || item.status === "canceled") && (
                    <button
                      type="button"
                      onClick={() => actions.retry(item.uid)}
                      className="text-xs underline"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </UplofileRoot>
  );
}
