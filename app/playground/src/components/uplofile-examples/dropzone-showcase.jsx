import React from "react";
import { UplofileRoot, UplofileDropzone, UplofileTrigger, UplofilePreview } from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Large dropzone with inline progress indicator and keyboard support
export default function DropzoneShowcase() {
  return (
    <div className="space-y-4">
      <UplofileRoot upload={upload} onRemove={onRemove} multiple accept="image/*,video/*">
        <UplofileDropzone className="border-2 border-dashed rounded-2xl p-8 text-center focus:outline-none">
          <div className="space-y-3">
            <div className="text-lg font-medium">Drag & drop files here</div>
            <div className="text-sm text-gray-500">Images and videos are supported</div>
            <UplofileTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
              {({ isUploading, uploadingCount, totalProgress }) => (
                <span>
                  {isUploading
                    ? `Uploading ${uploadingCount}… ${totalProgress ?? 0}%`
                    : "Browse files"}
                </span>
              )}
            </UplofileTrigger>
          </div>
          <div className="border-t mt-6 pt-6">
            <UplofilePreview />
          </div>
        </UplofileDropzone>
      </UplofileRoot>
    </div>
  );
}
