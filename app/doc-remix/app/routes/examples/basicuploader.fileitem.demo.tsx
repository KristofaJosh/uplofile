import type { UploadFileItem } from "@/components/ui/uplofile";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoDocumentOutline,
  IoReloadOutline,
} from "react-icons/io5";

export function BasicFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-1">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          <IoDocumentOutline className="h-4 w-4" />
        </div>
        <div className="grid gap-0.5 overflow-hidden">
          <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[400px]">
            {item.name}
          </span>
          {item.status === "uploading" && (
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-in-out"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        {item.status === "uploading" && (
          <IoReloadOutline className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {item.status === "done" && (
          <IoCheckmarkCircleOutline className="h-4 w-4 text-emerald-500" />
        )}
        {item.status === "error" && (
          <IoCloseOutline className="h-4 w-4 text-destructive" />
        )}
      </div>
    </div>
  );
}
