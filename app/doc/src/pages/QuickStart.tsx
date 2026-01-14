import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";

const QuickStart = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Quick Start</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build a fully functional file uploader in minutes.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Complete Example
          </h2>
          <p className="text-muted-foreground">
            Here's a complete example with styling, validation, and upload handling:
          </p>
          
          <CodeBlock
            code={`import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/uplofile";

function FileUploader() {
  const upload = async (file, signal, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      signal,
    });
    
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  };

  return (
    <UplofileRoot upload={upload} removeMode="strict" onRemove={onRemove}>
      <UplofileDropzone className="border-2 border-dashed rounded-lg p-8">
        <span>Drop files here or </span>
        <UplofileTrigger className="underline text-blue-500 cursor-pointer">
          Select files
        </UplofileTrigger>
        <div className="border-t my-6 py-6">
          <UplofilePreview />
        </div>
      </UplofileDropzone>
    </UplofileRoot>
  );
}`}
            language="tsx"
          />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            With Pre-hydrated Files
          </h2>
          <p className="text-muted-foreground">
            If you have existing files (e.g., when editing), pass them as initial values:
          </p>
          
          <CodeBlock
            code={`<UplofileRoot 
  initial={[
    { id: '1', name: 'existing-file.jpg', url: '/uploads/existing-file.jpg' },
    { id: '2', name: 'another-file.pdf', url: '/uploads/another-file.pdf' },
  ]}
>
  {/* ... */}
</UplofileRoot>`}
            language="tsx"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Server-side Delete
          </h2>
          <p className="text-muted-foreground">
            For strict deletion that requires server confirmation:
          </p>
          
          <CodeBlock
            code={`<UplofileRoot
  removeMode="strict"
  onRemove={async (item, signal) => {
    const res = await fetch(\`/api/files/\${item.id}\`, {
      method: 'DELETE',
      signal,
    });
    if (!res.ok) throw new Error('Delete failed');
  }}
>
  {/* ... */}
</UplofileRoot>`}
            language="tsx"
          />
        </section>
      </article>
    </DocsLayout>
  );
};

export default QuickStart;
