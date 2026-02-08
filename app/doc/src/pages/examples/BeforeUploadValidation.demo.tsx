import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UploadFileItem,
} from "@/components/ui/uplofile";
import { FileIcon, CheckCircle2, Loader2, X, AlertCircle } from "lucide-react";
import { mockUpload } from "@/lib/utils.ts";

const beforeUpload = async (items: UploadFileItem[]) => {
  return items.map((item) => {
    // Example: Reject files larger than 2MB
    if (item.file && item.file.size > 2 * 1024 * 1024) {
      return {
        uid: item.uid,
        valid: false,
        reason: "File too large (max 2MB)",
      };
    }

    // Example: Reject specific file names (e.g., restricted keywords)
    if (item.name.toLowerCase().includes("restricted")) {
      return {
        uid: item.uid,
        valid: false,
        reason: "File name contains restricted words",
      };
    }

    return { uid: item.uid, valid: true };
  });
};

export default function BeforeUploadValidationDemo() {
  return (
    <UplofileRoot upload={mockUpload} beforeUpload={beforeUpload}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Validation: Max 2MB, no "restricted" in filename.
        </p>
        <UplofileTrigger>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow">
            Select Files
          </button>
        </UplofileTrigger>

        <UplofilePreview
          render={({ items }) => (
            <div className="mt-6 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed rounded-lg bg-muted/5">
                  <p className="text-muted-foreground text-sm">
                    No files selected
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {items.map((item) => (
                    <ValidationFileItem key={item.uid} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </UplofileRoot>
  );
}

function ValidationFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div
      className={`flex flex-col p-3 rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-1 ${item.status === "error" ? "border-destructive/50 bg-destructive/5" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`p-2 rounded-md ${item.status === "error" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
          >
            <FileIcon className="h-4 w-4" />
          </div>
          <div className="grid gap-0.5 overflow-hidden">
            <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[400px]">
              {item.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {item.status === "uploading" && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {item.status === "done" && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          {item.status === "error" && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </div>

      {item.status === "error" && item.error && (
        <p className="mt-2 text-xs text-destructive font-medium flex items-center gap-1">
          {item.error}
        </p>
      )}

      {item.status === "uploading" && (
        <div className="mt-3 w-full bg-secondary rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
