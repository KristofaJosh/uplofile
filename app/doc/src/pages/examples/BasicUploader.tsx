import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

const ExampleBasicUploader = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Basic File Uploader</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A minimal file uploader with a button trigger and file preview list.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-lg bg-muted/30">
            <UplofileRoot upload={mockUpload}>
              <UplofileTrigger>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Select Files
                </button>
              </UplofileTrigger>

              <UplofilePreview
                render={({ items }) => (
                  <div className="mt-4 space-y-2">
                    {items.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No files selected</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.uid} className="text-sm text-foreground flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.status === "uploading" && (
                            <span className="text-muted-foreground">({item.progress}%)</span>
                          )}
                          {item.status === "done" && (
                            <span className="text-green-500">✓</span>
                          )}
                        </div>
                      ))
                    )}
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
} from "@/components/ui/uplofile";

const upload = async (file, signal, setProgress) => {
  // Your upload logic here
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData, signal });
  return await res.json(); // { url, id }
};

export function BasicUploader() {
  return (
    <UplofileRoot upload={upload}>
      <UplofileTrigger>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Select Files
        </button>
      </UplofileTrigger>

      <UplofilePreview
        render={({ items }) => (
          <div className="mt-4 space-y-2">
            {items.length === 0 ? (
              <p className="text-muted-foreground">No files selected</p>
            ) : (
              items.map((item) => (
                <div key={item.uid} className="text-sm">
                  {item.name} - {item.status}
                </div>
              ))
            )}
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
            <li>→ Uses <code className="code-inline">UplofileTrigger</code> with a custom button</li>
            <li>→ Simple file list display with <code className="code-inline">UplofilePreview</code></li>
            <li>→ Requires an <code className="code-inline">upload</code> function that returns <code className="code-inline">{`{ url, id }`}</code></li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleBasicUploader;
