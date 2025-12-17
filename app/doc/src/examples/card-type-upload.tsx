import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileCancel,
  UplofileRetry,
  UplofileRemove,
} from "@/components/ui/file-uploader";
import { upload, onRemove } from "@/utils/upload-simulator";

export default function CardTypeUpload() {
  return (
    <div>
      <UplofileRoot upload={upload} onRemove={onRemove}>
        <div className="flex items-center gap-4">
          <UplofileTrigger className="rounded-lg border px-3 py-2">
            Add files
          </UplofileTrigger>
        </div>
        <UplofilePreview
          render={({ items }) => (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.uid}
                  className="relative size-32 overflow-hidden rounded-xl border"
                  data-state={item.status}
                >
                  {(item.url || item.previewUrl) && (
                    <img
                      className="size-full object-cover"
                      src={item.url || item.previewUrl}
                      alt={item.name}
                    />
                  )}
                  {/* overlay */}
                  {(["error", "uploading"] as const).includes(item.status) && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-black/60 text-white">
                      {item.status === "error" ? (
                        <UplofileRetry className="rounded bg-white/10 px-2 py-1 text-xs">
                          Retry
                        </UplofileRetry>
                      ) : (
                        <div className="animate-spin text-lg">○</div>
                      )}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 z-20 flex gap-2 p-2">
                    <UplofileCancel
                      className="rounded bg-white/60 px-2 py-1 text-xs"
                      alwaysVisible
                    >
                      Cancel
                    </UplofileCancel>
                    <UplofileRemove className="rounded bg-white/90 px-2 py-1 text-xs">
                      Remove
                    </UplofileRemove>
                  </div>
                </div>
              ))}
            </div>
          )}
        />
      </UplofileRoot>
    </div>
  );
}
