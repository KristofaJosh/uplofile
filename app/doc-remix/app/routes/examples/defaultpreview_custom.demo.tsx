import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockOnRemove, mockUpload } from "@/lib/utils.ts";

export default function DefaultPreviewCustomDemo() {
  return (
    <UplofileRoot
      upload={mockUpload}
      onRemove={mockOnRemove}
      removeMode="strict"
    >
      <UplofileTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow">
          Select Files
        </button>
      </UplofileTrigger>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-sm font-medium mb-4">Custom Preview:</h3>
        <UplofilePreview
          render={({ items, actions }) => (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.uid}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm shadow-sm transition-opacity data-[removing=true]:opacity-70"
                  data-removing={item.status === "removing"}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-foreground">
                        {item.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                        {item.status === "removing" ? "removing" : item.status}
                      </span>
                    </div>
                    {item.status === "uploading" && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-[width]"
                          style={{ width: `${item.progress ?? 0}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.status === "uploading") {
                        actions.cancel(item.uid);
                        return;
                      }
                      actions.remove(item.uid);
                    }}
                    disabled={item.status === "removing"}
                    className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:pointer-events-none disabled:text-muted-foreground"
                    aria-label={`${
                      item.status === "uploading" ? "Cancel upload for" : "Remove"
                    } ${item.name} (${item.uid})`}
                  >
                    {item.status === "removing" && (
                      <span
                        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                        aria-hidden="true"
                      />
                    )}
                    {item.status === "removing"
                      ? "Removing"
                      : item.status === "uploading"
                        ? "Cancel"
                        : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        />
      </div>
    </UplofileRoot>
  );
}
