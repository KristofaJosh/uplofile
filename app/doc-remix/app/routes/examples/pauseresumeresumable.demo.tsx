import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockResumableUpload } from "@/lib/utils.ts";
import { IoCloudUploadOutline } from "react-icons/io5";
import { PauseResumeToolbar } from "./pauseresumeresumable.toolbar.demo.tsx";
import { FileRow } from "./pauseresumeresumable.filerow.demo.tsx";

export default function PauseResumeResumableDemo() {
  return (
    <UplofileRoot upload={mockResumableUpload} multiple accept="*/*">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <UplofileTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95">
              <IoCloudUploadOutline className="h-4 w-4" />
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
