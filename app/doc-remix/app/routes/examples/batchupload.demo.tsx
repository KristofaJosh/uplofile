import { useCallback, useState } from "react";
import {
  UplofilePreview,
  UplofileRoot,
  UplofileTrigger,
  type UploadFileItem,
  type UploadStatus,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

type BatchStatus = Extract<UploadStatus, "idle" | "uploading" | "done" | "error">;

const queueFile = async (file: File) => ({
  id: file.name,
  url: URL.createObjectURL(file),
});

export default function BatchUploadDemo() {
  const [status, setStatus] = useState<BatchStatus>("idle");
  const [progress, setProgress] = useState(0);

  const uploadBatch = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setStatus("uploading");
    setProgress(0);

    try {
      await mockBatchUpload(files, setProgress);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, []);

  return (
    <UplofileRoot upload={queueFile} multiple accept="*/*">
      <UplofilePreview
        render={({ items }) => {
          const files = items.flatMap((item) => (item.file ? [item.file] : []));

          return (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex flex-wrap gap-2">
                  <UplofileTrigger asChild>
                    <button className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium">
                      Add files
                    </button>
                  </UplofileTrigger>

                  <button
                    type="button"
                    onClick={() => uploadBatch(files)}
                    disabled={files.length === 0 || status === "uploading"}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Upload batch{files.length ? ` (${files.length})` : ""}
                  </button>
                </div>

                {status !== "idle" && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{status}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="divide-y overflow-hidden rounded-xl border border-border bg-card">
                {items.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    Add files, then upload them together as one batch.
                  </p>
                ) : (
                  items.map((item) => <BatchFileItem key={item.uid} item={item} />)
                )}
              </div>
            </div>
          );
        }}
      />
    </UplofileRoot>
  );
}

async function mockBatchUpload(
  files: File[],
  setProgress: (progress: number) => void,
) {
  await mockUpload(files[0], undefined, setProgress);

  return files.map((file) => ({
    id: file.name,
    url: `https://example.com/uploads/${encodeURIComponent(file.name)}`,
  }));
}

function BatchFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="p-3">
      <p className="truncate text-sm font-medium">{item.name}</p>
    </div>
  );
}
