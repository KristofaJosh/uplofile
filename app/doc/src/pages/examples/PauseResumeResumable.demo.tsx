import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRemove,
  UploadFileItem,
} from "@/components/ui/uplofile";
import { useUplofile } from "uplofile";
import {
  clearMockResumableCheckpoint,
  mockResumableUpload,
} from "@/lib/utils.ts";
import {
  Upload,
  Pause,
  Play,
  RotateCcw,
  X,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const clearCheckpointForItem = (item: UploadFileItem) => {
  if (!item.file) return;
  clearMockResumableCheckpoint(item.file);
};

export default function PauseResumeResumableDemo() {
  return (
    <UplofileRoot upload={mockResumableUpload} multiple accept="*/*">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <UplofileTrigger>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95">
              <Upload className="h-4 w-4" />
              Add Files
            </button>
          </UplofileTrigger>

          <PauseResumeToolbar />
        </div>

        <p className="text-xs text-muted-foreground">
          This demo treats <code className="code-inline">canceled</code> as
          "paused". Resume uses <code className="code-inline">retry</code> from
          the last checkpoint, while Retry clears the checkpoint and restarts
          from 0%.
        </p>

        <UplofilePreview
          render={({ items }) => (
            <div className="divide-y rounded-xl border border-border bg-card shadow-sm">
              {items.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Add files to test pause and resume behavior.
                </div>
              )}

              {items.map((item) => (
                <FileRow key={item.uid} item={item} />
              ))}
            </div>
          )}
        />
      </div>
    </UplofileRoot>
  );
}

function PauseResumeToolbar() {
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
          <Pause className="h-3 w-3" />
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
          <Play className="h-3 w-3" />
          Resume all ({paused})
        </button>
      )}
    </div>
  );
}

function FileRow({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <StatusBadge item={item} />
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${item.progress ?? 0}%` }}
          />
        </div>
      </div>

      <ActionButtons item={item} />

      <UplofileRemove
        uid={item.uid}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </UplofileRemove>
    </div>
  );
}

function ActionButtons({ item }: { item: UploadFileItem }) {
  const { actions } = useUplofile();

  if (item.status === "uploading") {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => actions.cancel(item.uid)}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          <Pause className="h-3 w-3" />
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
          <X className="h-3 w-3" />
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
          <Play className="h-3 w-3" />
          Resume
        </button>
        <button
          onClick={() => {
            clearCheckpointForItem(item);
            actions.retry(item.uid);
          }}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
        >
          <RotateCcw className="h-3 w-3" />
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
        <RotateCcw className="h-3 w-3" />
        Retry
      </button>
    );
  }

  return null;
}

function StatusBadge({ item }: { item: UploadFileItem }) {
  if (item.status === "uploading") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        {item.progress ?? 0}%
      </span>
    );
  }

  if (item.status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <CheckCircle2 className="h-3 w-3" />
        done
      </span>
    );
  }

  if (item.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-destructive">
        <AlertTriangle className="h-3 w-3" />
        error
      </span>
    );
  }

  if (item.status === "canceled") {
    return <span className="text-xs text-amber-600">paused</span>;
  }

  return <span className="text-xs text-muted-foreground">{item.status}</span>;
}
