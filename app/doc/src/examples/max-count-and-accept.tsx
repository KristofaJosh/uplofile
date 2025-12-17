import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile.ts";
import { upload, onRemove } from "@/utils/upload-simulator";

export default function MaxCountAndAccept() {
  return (
    <UplofileRoot
      upload={upload}
      onRemove={onRemove}
      maxCount={3}
      accept="image/*"
    >
      <UplofileTrigger
        render={({ items }) => (
          <button
            type="button"
            className="rounded-lg border px-3 py-2"
            aria-label="Select images"
          >
            {items.length > 0 ? `Add more (${items.length}/3)` : "Select images"}
          </button>
        )}
      />
      <UplofilePreview />
    </UplofileRoot>
  );
}
