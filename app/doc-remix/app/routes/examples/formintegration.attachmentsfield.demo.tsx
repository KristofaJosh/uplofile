import {
  UplofileDropzone,
  UplofileHiddenInput,
  UplofilePreview,
  UplofileRoot,
  UplofileTrigger,
} from "@/components/ui/uplofile";
import { IoAttachOutline, IoCloudUploadOutline } from "react-icons/io5";
import { mockUpload } from "@/lib/utils.ts";
import { FormFileItem } from "./formintegration.fileitem.demo.tsx";

export function AttachmentsField() {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
        <IoAttachOutline className="h-3 w-3" />
        Attachments
      </label>
      <UplofileRoot upload={mockUpload} multiple name="attachments">
        <UplofileHiddenInput />

        <UplofileDropzone className="group relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/10">
          <UplofileTrigger>
            <div className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <IoCloudUploadOutline className="h-6 w-6" />
              </div>
              <div className="grid gap-0.5">
                <span className="text-sm font-semibold text-gray-900">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, PNG, JPG up to 10MB
                </span>
              </div>
            </div>
          </UplofileTrigger>
        </UplofileDropzone>

        <UplofilePreview
          render={({ items }) => (
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <FormFileItem key={item.uid} item={item} />
              ))}
            </div>
          )}
        />
      </UplofileRoot>
    </div>
  );
}
