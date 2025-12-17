import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileCancel,
  UplofileRetry,
} from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Single image avatar uploader with spinner and cancel
export default function SpinnerAvatarUpload() {
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Avatar</div>
      <UplofileRoot upload={upload} onRemove={onRemove} multiple={false} accept="image/*">
        <div className="flex items-center gap-4">
          <div className="relative size-20 rounded-full overflow-hidden border">
            <UplofilePreview
              render={({ items, actions }) => (
                <>
                  {items.length === 0 && (
                    <div className="grid place-items-center w-full h-full text-xs text-gray-400">
                      No photo
                    </div>
                  )}
                  {items.map((item) => (
                    <div key={item.uid} className="w-full h-full">
                      {item.url || item.previewUrl ? (
                        <img
                          src={item.url || item.previewUrl}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      ) : null}
                      {item.status === "uploading" && (
                        <div className="absolute inset-0 grid place-items-center bg-black/40 text-white text-xs">
                          <span className="animate-spin">●</span>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
                        <UplofileCancel
                          uid={item.uid}
                          className="px-2 py-1 text-[10px] rounded bg-white/90 border"
                        >
                          Cancel
                        </UplofileCancel>
                        {["error", "canceled"].includes(item.status) && (
                          <UplofileRetry
                            uid={item.uid}
                            className="px-2 py-1 text-[10px] rounded bg-white/90 border"
                          >
                            Retry
                          </UplofileRetry>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <UplofileTrigger className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
              {({ isUploading, totalProgress }) => (
                <span>
                  {isUploading ? `Uploading… ${totalProgress ?? 0}%` : "Upload photo"}
                </span>
              )}
            </UplofileTrigger>
            <div className="text-xs text-gray-500">PNG, JPG up to 5MB</div>
          </div>
        </div>
      </UplofileRoot>
    </div>
  );
}
