import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

const ExampleDropzoneUploader = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Dropzone Uploader</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A drag-and-drop zone with visual feedback when files are dragged over.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-lg bg-muted/30">
            <UplofileRoot upload={mockUpload} multiple>
              <UplofileDropzone className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5">
                <UplofileTrigger>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    Drag & drop files here, or click to select
                  </span>
                </UplofileTrigger>
              </UplofileDropzone>

              <UplofilePreview
                render={({ items }) => (
                  <ul className="mt-4 space-y-1">
                    {items.map((item) => (
                      <li key={item.uid} className="text-sm text-foreground flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.status === "uploading" && (
                          <span className="text-muted-foreground">({item.progress}%)</span>
                        )}
                        {item.status === "done" && <span className="text-green-500">✓</span>}
                      </li>
                    ))}
                  </ul>
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
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";

export function DropzoneUploader() {
  return (
    <UplofileRoot upload={upload} multiple>
      <UplofileDropzone 
        className="border-2 border-dashed rounded-lg p-12 text-center 
                   hover:border-primary/50 transition-colors
                   data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5"
      >
        <UplofileTrigger>
          <span className="text-muted-foreground hover:text-foreground cursor-pointer">
            Drag & drop files here, or click to select
          </span>
        </UplofileTrigger>
      </UplofileDropzone>

      <UplofilePreview
        render={({ items }) => (
          <ul className="mt-4 space-y-1">
            {items.map((item) => (
              <li key={item.uid} className="text-sm">
                {item.name} - {item.status}
              </li>
            ))}
          </ul>
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
            <li>→ Uses <code className="code-inline">data-[dragging=true]</code> for visual feedback on drag</li>
            <li>→ Combines dropzone with clickable trigger</li>
            <li>→ <code className="code-inline">multiple</code> prop enables multi-file selection</li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleDropzoneUploader;
