import { useUplofile } from "uplofile";
import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";

export function PauseResumeToolbar() {
  const { items, actions } = useUplofile();
  const uploading = items.filter((item) => item.status === "uploading").length;
  const paused = items.filter((item) => item.status === "canceled").length;

  if (uploading === 0 && paused === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      {uploading > 0 && (
        <button
          onClick={() => {
            items
              .filter((item) => item.status === "uploading")
              .forEach((item) => actions.cancel(item.uid));
          }}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 font-medium hover:bg-muted"
        >
          <IoPauseOutline className="h-3 w-3" />
          Pause all ({uploading})
        </button>
      )}

      {paused > 0 && (
        <button
          onClick={() => {
            items
              .filter((item) => item.status === "canceled")
              .forEach((item) => actions.retry(item.uid));
          }}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 font-medium hover:bg-muted"
        >
          <IoPlayOutline className="h-3 w-3" />
          Resume all ({paused})
        </button>
      )}
    </div>
  );
}
