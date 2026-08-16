import { UplofileDropzone, UplofileTrigger } from "@/components/ui/uplofile";
import { IoCloudUploadOutline } from "react-icons/io5";

export function DropTarget() {
  return (
    <UplofileDropzone className="group relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:border-primary/50 transition-all duration-200 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5 data-[dragging=true]:scale-[1.01]">
      <UplofileTrigger>
        <div className="flex flex-col items-center gap-4 cursor-pointer">
          <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
            <IoCloudUploadOutline className="h-8 w-8" />
          </div>
          <div className="grid gap-1">
            <p className="text-sm font-semibold">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">Any file type</p>
          </div>
        </div>
      </UplofileTrigger>
    </UplofileDropzone>
  );
}
