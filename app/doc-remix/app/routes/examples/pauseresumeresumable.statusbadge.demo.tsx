import type { UploadFileItem } from "@/components/ui/uplofile";
import {
  IoCheckmarkCircleOutline,
  IoReloadOutline,
  IoWarningOutline,
} from "react-icons/io5";

export function StatusBadge({ item }: { item: UploadFileItem }) {
  if (item.status === "uploading") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <IoReloadOutline className="h-3 w-3 animate-spin" />
        {item.progress ?? 0}%
      </span>
    );
  }

  if (item.status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <IoCheckmarkCircleOutline className="h-3 w-3" />
        done
      </span>
    );
  }

  if (item.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-destructive">
        <IoWarningOutline className="h-3 w-3" />
        error
      </span>
    );
  }

  if (item.status === "canceled") {
    return <span className="text-xs text-amber-600">paused</span>;
  }

  return <span className="text-xs text-muted-foreground">{item.status}</span>;
}
