import type { UploadFileItem } from "@/components/ui/uplofile";
import {
  IoAlertCircleOutline,
  IoAttachOutline,
  IoCheckmarkCircleOutline,
  IoReloadOutline,
} from "react-icons/io5";

export function FormFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm animate-in fade-in slide-in-from-top-1">
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={`p-1.5 rounded-md ${item.status === "error" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
        >
          {item.status === "error" ? (
            <IoAlertCircleOutline className="h-3 w-3" />
          ) : (
            <IoAttachOutline className="h-3 w-3" />
          )}
        </div>
        <span
          className={`text-xs font-medium truncate max-w-[200px] ${item.status === "error" ? "text-destructive" : ""}`}
        >
          {item.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {item.status === "uploading" && (
          <>
            <span className="text-[10px] font-bold text-muted-foreground">
              {item.progress}%
            </span>
            <IoReloadOutline className="h-3 w-3 animate-spin text-primary" />
          </>
        )}
        {item.status === "done" && (
          <IoCheckmarkCircleOutline className="h-4 w-4 text-emerald-500" />
        )}
        {item.status === "error" && (
          <span className="text-[10px] font-bold text-destructive uppercase">
            Failed
          </span>
        )}
      </div>
    </div>
  );
}
