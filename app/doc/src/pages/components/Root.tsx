import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";

const ComponentRoot = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Root</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The container component that manages file state and provides context to child components.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>
          
          <CodeBlock
            code={`import { UplofileRoot } from "@/components/uplofile";

<UplofileRoot upload={upload} removeMode="strict" onRemove={onRemove}>
  {/* Child components */}
</UplofileRoot>`}
            language="tsx"
          />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Props
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold">Prop</th>
                  <th className="text-left py-3 px-2 font-semibold">Type</th>
                  <th className="text-left py-3 px-2 font-semibold">Default</th>
                  <th className="text-left py-3 px-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">maxCount</code></td>
                  <td className="py-3 px-2">number</td>
                  <td className="py-3 px-2">Infinity</td>
                  <td className="py-3 px-2">Maximum number of files allowed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">maxSize</code></td>
                  <td className="py-3 px-2">number</td>
                  <td className="py-3 px-2">Infinity</td>
                  <td className="py-3 px-2">Maximum file size in bytes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">accept</code></td>
                  <td className="py-3 px-2">string</td>
                  <td className="py-3 px-2">*</td>
                  <td className="py-3 px-2">Accepted file types (MIME types or extensions)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">initial</code></td>
                  <td className="py-3 px-2">FileItem[]</td>
                  <td className="py-3 px-2">[]</td>
                  <td className="py-3 px-2">Pre-hydrated files to display as already uploaded</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">removeMode</code></td>
                  <td className="py-3 px-2">"instant" | "strict"</td>
                  <td className="py-3 px-2">"instant"</td>
                  <td className="py-3 px-2">How file removal is handled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">onFilesChange</code></td>
                  <td className="py-3 px-2">(files) =&gt; void</td>
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">Called when files are added or removed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">onRemove</code></td>
                  <td className="py-3 px-2">(item, signal) =&gt; Promise</td>
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">Called when removing a file in strict mode</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ComponentRoot;
