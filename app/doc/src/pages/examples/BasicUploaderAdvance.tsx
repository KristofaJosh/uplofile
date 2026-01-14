import {
  UplofileDropzone,
  UplofilePreview,
  UplofileRoot,
  UplofileTrigger,
} from "@/components/ui/uplofile";
import { mockOnRemove, mockUpload } from "@/lib/utils.ts";

// Basic usage: Dropzone + Trigger + Default Preview
export default function BasicUploaderAdvance() {
  return (
    <div className="space-y-4">
      <UplofileRoot
        upload={mockUpload}
        onRemove={mockOnRemove}
        multiple
        accept="image/*"
      >
        <UplofileDropzone className="border rounded-xl p-6 text-sm text-gray-600">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">Drop images here</div>
              <div className="text-gray-500">
                or use the button to pick files
              </div>
            </div>
            <UplofileTrigger className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
              Choose files
            </UplofileTrigger>
          </div>
          <div className="border-t my-4 pt-4">
            <UplofilePreview />
          </div>
        </UplofileDropzone>
      </UplofileRoot>
    </div>
  );
}
