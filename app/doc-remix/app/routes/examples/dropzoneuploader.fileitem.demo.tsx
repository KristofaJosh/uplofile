import type { UploadFileItem } from "@/components/ui/uplofile";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoDocumentOutline,
  IoReloadOutline,
} from "react-icons/io5";

export function DropzoneFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <IoDocumentOutline className="h-5 w-5" />
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
