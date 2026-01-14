import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { FileIcon, CheckCircle2, Loader2, X } from "lucide-react";
import { mockUpload } from "@/lib/utils.ts";

export default function BasicUploaderDemo() {
  return (
    <UplofileRoot upload={mockUpload}>
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
                  <div
                    key={item.uid}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <FileIcon className="h-4 w-4" />
                      </div>
                      <div className="grid gap-0.5 overflow-hidden">
                        <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[400px]">
                          {item.name}
                        </span>
                        {item.status === "uploading" && (
                          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all duration-300 ease-in-out"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}
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
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
    </UplofileRoot>
  );
}
