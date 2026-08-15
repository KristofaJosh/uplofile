import type { UploadFileItem } from "@/components/ui/uplofile";
import { useUplofile } from "uplofile";
import {
  IoCloseOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { clearCheckpointForItem } from "./pauseresumeresumable.checkpoint.demo.tsx";

export function ActionButtons({ item }: { item: UploadFileItem }) {
  const { actions } = useUplofile();

  if (item.status === "uploading") {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => actions.cancel(item.uid)}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          <IoPauseOutline className="h-3 w-3" />
          Pause
        </button>
        <button
          onClick={() => {
            clearCheckpointForItem(item);
            actions.cancel(item.uid);
            actions.remove(item.uid);
          }}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          <IoCloseOutline className="h-3 w-3" />
          Cancel
        </button>
      </div>
    );
  }

  if (item.status === "canceled") {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => actions.retry(item.uid)}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          <IoPlayOutline className="h-3 w-3" />
          Resume
        </button>
        <button
          onClick={() => {
            clearCheckpointForItem(item);
            actions.retry(item.uid);
          }}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          <IoRefreshOutline className="h-3 w-3" />
          Retry
        </button>
      </div>
    );
  }

  if (item.status === "error") {
    return (
      <button
        onClick={() => {
          clearCheckpointForItem(item);
          actions.retry(item.uid);
        }}
        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
      >
        <IoRefreshOutline className="h-3 w-3" />
        Retry
      </button>
    );
  }

  return null;
}
