import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRemove,
  UplofileRetry,
} from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Simulate a product images moderation panel with strict removal
export default function ProductModeration() {
  // seed a couple of initial images (from placeholder via data URLs not available here, so left empty to be re-uploaded)
  const initial = [
    {
      uid: "seed-1",
      id: "pimg_1",
      name: "old-1.jpg",
      url: undefined,
    },
  ];

  return (
    <UplofileRoot
      upload={upload}
      onRemove={onRemove}
      removeMode="strict"
      initial={initial}
    >
      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-semibold">Product moderation</h3>
            <p className="text-xs text-gray-500">
              Strict remove — deletion must succeed server-side
            </p>
          </div>
          <UplofileTrigger className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
            Add image
          </UplofileTrigger>
        </div>

        <div className="rounded-xl border p-3">
          <UplofilePreview
            render={({ items }) => (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.uid}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-50 relative">
                      {item.url || item.previewUrl ? (
                        <img
                          src={item.url || item.previewUrl}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="grid place-items-center w-full h-full text-xs text-gray-400">
                          No preview
                        </div>
                      )}
                      {item.status === "uploading" && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                          <div
                            className="h-full bg-emerald-600"
                            style={{
                              width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-xs flex items-center justify-between">
                      <div className="truncate">
                        <div className="font-medium truncate max-w-[10rem]">
                          {item.name}
                        </div>
                        <div className="text-gray-500">{item.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <UplofileRemove
                          uid={item.uid}
                          className="px-2 py-1 rounded bg-white border disabled:opacity-50"
                          disabled={
                            item.status === "uploading" ||
                            item.status === "removing"
                          }
                        >
                          {item.status === "removing"
                            ? "Moderating…"
                            : "Moderate & remove"}
                        </UplofileRemove>
                        {item.status === "error" && (
                          <UplofileRetry
                            uid={item.uid}
                            className="px-2 py-1 rounded bg-white border"
                          >
                            Retry upload
                          </UplofileRetry>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </div>
    </UplofileRoot>
  );
}
