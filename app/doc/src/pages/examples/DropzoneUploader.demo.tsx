import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
  UploadFileItem,
} from "@/components/ui/uplofile";
import { Upload, FileIcon, X, CheckCircle2, Loader2 } from "lucide-react";
import { mockUpload } from "@/lib/utils.ts";

export default function DropzoneUploaderDemo() {
  return (
    <UplofileRoot upload={mockUpload} multiple>
      <UplofileDropzone className="group relative border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:border-primary/50 transition-all duration-200 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5 data-[dragging=true]:scale-[1.01]">
        <UplofileTrigger>
          <div className="flex flex-col items-center gap-4 cursor-pointer">
            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
              <Upload className="h-8 w-8" />
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-semibold">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </UplofileTrigger>
      </UplofileDropzone>

      <UplofilePreview
        render={({ items }) => (
          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <DropzoneFileItem key={item.uid} item={item} />
            ))}
          </div>
        )}
      />
    </UplofileRoot>
  );
}

function DropzoneFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileIcon className="h-5 w-5" />
      </div>
      <div className="grid flex-1 gap-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">{item.name}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {item.status === "uploading" ? `${item.progress}%` : item.status}
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: item.status === "done" ? "100%" : `${item.progress}%`,
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {item.status === "uploading" && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {item.status === "done" && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        )}
        {item.status === "error" && <X className="h-4 w-4 text-destructive" />}
      </div>
    </div>
  );
}
