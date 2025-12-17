import {
  UplofileRoot,
  UplofileTrigger,
  UplofileDropzone,
  UplofilePreview,
} from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Basic usage: Dropzone + Trigger + Default Preview
export default function BasicUpload() {
  return (
    <div className="space-y-4">
      <UplofileRoot
        upload={upload}
        onRemove={onRemove}
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
