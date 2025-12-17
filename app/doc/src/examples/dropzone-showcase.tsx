import React from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofileDropzone,
  UplofilePreview,
} from "@/components/ui/file-uploader";
import { upload, onRemove } from "@/utils/upload-simulator";

export default function DropzoneShowcase() {
  return (
    <UplofileRoot upload={upload} onRemove={onRemove} accept="image/*">
      <UplofileDropzone>
        <div className="rounded-xl border border-dashed p-8 text-center">
          <div className="mb-2 text-sm font-medium">Drag images here</div>
          <div className="text-xs opacity-70">or</div>
          <div className="mt-3">
            <UplofileTrigger className="rounded-lg border px-3 py-2">
              Browse files
            </UplofileTrigger>
          </div>
        </div>
      </UplofileDropzone>
      <UplofilePreview />
    </UplofileRoot>
  );
}
