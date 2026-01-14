import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRemove,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "IMG";
  if (ext === "pdf") return "PDF";
  if (["doc", "docx"].includes(ext || "")) return "DOC";
  return "FILE";
}

const ExampleFileListWithActions = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">File List with Actions</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A detailed file list with file info, progress indicators, and remove buttons.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-lg bg-muted/30 space-y-3">
            <UplofileRoot upload={mockUpload} multiple>
              <UplofileTrigger>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Add Files
                </button>
              </UplofileTrigger>

              <UplofilePreview
                render={({ items }) => (
                  <div className="mt-4 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.uid}
                        className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
                      >
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs font-medium">
                          {getFileIcon(item.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.file ? formatBytes(item.file.size) : "—"}
                            {item.status === "uploading" && ` • ${item.progress}%`}
                            {item.status === "done" && " • Done"}
                            {item.status === "error" && " • Error"}
                          </p>
                        </div>
                        <UplofileRemove
                          uid={item.uid}
                          className="text-muted-foreground hover:text-destructive text-xl transition-colors"
                        >
                          ×
                        </UplofileRemove>
                      </div>
                    ))}
                  </div>
                )}
              />
            </UplofileRoot>
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Code
          </h2>
          <CodeBlock
            language="tsx"
            code={`import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRemove,
} from "@/components/ui/uplofile";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function FileListWithActions() {
  return (
    <UplofileRoot upload={upload} multiple>
      <UplofileTrigger>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Add Files
        </button>
      </UplofileTrigger>

      <UplofilePreview
        render={({ items }) => (
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.uid} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.file ? formatBytes(item.file.size) : "—"} • {item.status}
                  </p>
                </div>
                <UplofileRemove uid={item.uid} className="hover:text-destructive">
                  ×
                </UplofileRemove>
              </div>
            ))}
          </div>
        )}
      />
    </UplofileRoot>
  );
}`}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Key Points
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>→ Uses <code className="code-inline">UplofileRemove</code> component with <code className="code-inline">uid</code> prop</li>
            <li>→ File type icons based on extension</li>
            <li>→ Human-readable file sizes</li>
            <li>→ Status shown inline (uploading %, done, error)</li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleFileListWithActions;
