import { clsx } from "clsx";
import { UplofileRemove, type UploadFileItem } from "@/components/ui/uplofile";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { formatBytes } from "@/lib/utils.ts";
import { getFileIcon } from "./filelistwithactions.fileicon.demo.tsx";

export function FileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-left-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {getFileIcon(item.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-semibold truncate text-foreground">
            {item.name}
          </p>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {item.file ? formatBytes(item.file.size) : "—"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.status === "uploading" ? (
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-medium tabular-nums">
                {item.progress}%
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {item.status === "done" && (
                <IoCheckmarkCircleOutline className="h-3 w-3 text-emerald-500" />
              )}
              {item.status === "error" && (
                <IoAlertCircleOutline className="h-3 w-3 text-destructive" />
              )}
              <span
                className={clsx(
                  "text-[10px] font-bold uppercase tracking-tighter italic",
                  item.status === "done" && "text-emerald-600",
                  item.status === "error" && "text-destructive",
                  item.status === "idle" && "text-muted-foreground",
                )}
              >
                {item.status}
              </span>
            </div>
          )}
        </div>
      </div>
      <UplofileRemove
        uid={item.uid}
        className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
      >
        <IoCloseOutline className="h-4 w-4" />
      </UplofileRemove>
    </div>
  );
}
