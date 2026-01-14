import { clsx } from "clsx";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRemove,
  UploadFileItem,
} from "@/components/ui/uplofile";
import {
  FileIcon,
  FileImage,
  FileText,
  FileArchive,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { mockUpload, formatBytes } from "@/lib/utils.ts";

export default function FileListWithActionsDemo() {
  return (
    <UplofileRoot upload={mockUpload} multiple>
      <UplofileTrigger>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm font-medium text-sm active:scale-95">
          <Plus className="h-4 w-4" />
          Add Files
        </button>
      </UplofileTrigger>

      <UplofilePreview
        render={({ items }) => (
          <div className="mt-6 divide-y divide-border border rounded-xl bg-card shadow-sm overflow-hidden">
            {items.length === 0 && (
              <div className="p-12 text-center">
                <FileIcon className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No files added yet.
                </p>
              </div>
            )}
            {items.map((item) => (
              <FileItem key={item.uid} item={item} />
            ))}
          </div>
        )}
      />
    </UplofileRoot>
  );
}

function FileItem({ item }: { item: UploadFileItem }) {
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
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              )}
              {item.status === "error" && (
                <AlertCircle className="h-3 w-3 text-destructive" />
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
        <X className="h-4 w-4" />
      </UplofileRemove>
    </div>
  );
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
    return <FileImage className="h-5 w-5" />;
  if (ext === "pdf" || ["doc", "docx"].includes(ext || ""))
    return <FileText className="h-5 w-5" />;
  if (["zip", "rar", "7z"].includes(ext || ""))
    return <FileArchive className="h-5 w-5" />;
  return <FileIcon className="h-5 w-5" />;
}
