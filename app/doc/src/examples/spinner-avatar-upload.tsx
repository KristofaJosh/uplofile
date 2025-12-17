import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRetry,
} from "@/components/ui/uplofile.ts";
import { upload } from "@/utils/upload-simulator";

export default function SpinnerAvatarUpload() {
  return (
    <UplofileRoot
      upload={upload}
      multiple={false}
      accept="image/*"
      name="avatar"
    >
      <div className="flex items-center gap-4">
        <div className="relative size-24 overflow-hidden rounded-full border">
          <UplofilePreview
            render={({ items, actions }) => (
              <div className="relative size-full">
                {items[0] && (
                  <img
                    className="size-full object-cover"
                    src={items[0].url || items[0].previewUrl}
                    alt={items[0].name}
                  />
                )}
                {items[0] && items[0].status === "uploading" && (
                  <button
                    type="button"
                    onClick={() => actions.cancel(items[0].uid)}
                    className="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-white"
                  >
                    <span className="animate-spin">○</span>
                  </button>
                )}
                {items[0] &&
                  ["error", "canceled"].includes(items[0].status) && (
                    <UplofileRetry
                      className="absolute inset-0 grid place-items-center rounded-full bg-black/60 text-white"
                      uid={items[0].uid}
                    >
                      Retry
                    </UplofileRetry>
                  )}
              </div>
            )}
          />
        </div>
        <UplofileTrigger className="rounded-lg border px-3 py-2">
          Change avatar
        </UplofileTrigger>
      </div>
    </UplofileRoot>
  );
}
