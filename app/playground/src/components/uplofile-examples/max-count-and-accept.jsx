import React from "react";
import { UplofileRoot, UplofileTrigger, UplofilePreview } from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Demonstrate maxCount limit and file type acceptance
export default function MaxCountAndAccept() {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">Only images, up to 3 files</div>
      <UplofileRoot upload={upload} onRemove={onRemove} multiple accept="image/*" maxCount={3}>
        <div className="flex items-center gap-2">
          <UplofileTrigger className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
            {({ items }) => (
              <span>
                {items.length >= 3 ? "Limit reached" : `Add (${items.length}/3)`}
              </span>
            )}
          </UplofileTrigger>
          <div className="text-xs text-gray-500">PNG, JPG, GIF accepted</div>
        </div>
        <div className="border rounded-xl p-3">
          <UplofilePreview />
        </div>
      </UplofileRoot>
    </div>
  );
}
