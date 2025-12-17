import React from "react";
import { clsx } from "clsx";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileCancel,
  UplofileRetry,
  UplofileRemove,
} from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Card-like thumbnails with overlayed actions
export default function CardTypeUpload() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Card type upload</h3>
        <div className="text-sm text-gray-500">Optimistic remove (default)</div>
      </div>
      <UplofileRoot upload={upload} onRemove={onRemove}>
        <div className="flex items-center gap-3">
          <UplofileTrigger className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
            Pick files
          </UplofileTrigger>
          <UplofilePreview
            render={({ items }) => (
              <div className="flex flex-wrap gap-3">
                {items.map((item) => (
                  <div key={item.uid} className="relative size-20 rounded-md shadow overflow-hidden">
                    {["error", "uploading"].includes(item.status) && (
                      <UplofileRetry
                        className={clsx(
                          "flex items-center justify-center",
                          "absolute rounded w-full h-full z-10 inset-0 bg-black/60 text-white text-xs",
                        )}
                        uid={item.uid}
                      >
                        {item.status === "error" ? "Retry" : <span className="animate-spin">●</span>}
                      </UplofileRetry>
                    )}
                    {item.url || item.previewUrl ? (
                      <img
                        className="object-cover w-full h-full"
                        src={item.url || item.previewUrl}
                        alt={item.name}
                      />
                    ) : (
                      <div className="grid place-items-center w-full h-full text-xs text-gray-500">No preview</div>
                    )}
                    <UplofileCancel
                      className={clsx(
                        "bg-white cursor-pointer border rounded-full size-5 text-black text-xs absolute top-1 right-1",
                        item.status === "uploading" && "z-20",
                      )}
                      asChild
                      uid={item.uid}
                    >
                      <button>✕</button>
                    </UplofileCancel>
                    <UplofileRemove
                      className={clsx(
                        "absolute bottom-1 left-1 right-1 mx-1 px-1 py-0.5 rounded text-[10px]",
                        "bg-white/80 backdrop-blur border text-gray-900",
                        item.status === "removing" && "opacity-60",
                        item.status === "error" && "text-red-600",
                        item.status === "uploading" && "hidden",
                      )}
                      uid={item.uid}
                    >
                      {item.status === "removing" ? "Removing…" : "Remove"}
                    </UplofileRemove>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </UplofileRoot>
    </div>
  );
}
