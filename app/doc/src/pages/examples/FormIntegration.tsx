import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
  UplofileHiddenInput,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

const ExampleFormIntegration = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Form submitted:", Object.fromEntries(formData));
    alert("Form submitted! Check console for data.");
  };

  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Form Integration</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Integrate uplofile into standard HTML forms with hidden input for form submission.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-lg bg-muted/30">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Attachments</label>
                <UplofileRoot upload={mockUpload} multiple name="attachments">
                  <UplofileHiddenInput />
                  
                  <UplofileDropzone className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5">
                    <UplofileTrigger>
                      <span className="text-muted-foreground text-sm cursor-pointer hover:text-foreground">
                        Drop files or click to upload
                      </span>
                    </UplofileTrigger>
                  </UplofileDropzone>

                  <UplofilePreview
                    render={({ items }) => (
                      <ul className="mt-2 text-sm space-y-1">
                        {items.map((item) => (
                          <li key={item.uid} className="text-foreground flex items-center gap-2">
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
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Submit
              </button>
            </form>
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
  UplofileHiddenInput,
} from "@/components/ui/uplofile";

export function FormIntegration() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Files are available as JSON in formData.get("attachments")
    console.log("Form data:", Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input type="text" name="title" className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Attachments</label>
        <UplofileRoot upload={upload} multiple name="attachments">
          <UplofileHiddenInput />

          <UplofileDropzone className="border-2 border-dashed rounded-lg p-6 text-center">
            <UplofileTrigger>
              Drop files or click to upload
            </UplofileTrigger>
          </UplofileDropzone>

          <UplofilePreview
            render={({ items }) => (
              <ul className="mt-2 text-sm">
                {items.map((item) => (
                  <li key={item.uid}>{item.name} - {item.status}</li>
                ))}
              </ul>
            )}
          />
        </UplofileRoot>
      </div>

      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Submit
      </button>
    </form>
  );
}`}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Key Points
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>→ Uses <code className="code-inline">UplofileHiddenInput</code> for form compatibility</li>
            <li>→ Set <code className="code-inline">name</code> prop on Root for the form field name</li>
            <li>→ Uploaded file URLs accessible as JSON in FormData</li>
            <li>→ Works with standard form handling and validation</li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleFormIntegration;
