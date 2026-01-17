import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";

const ComponentPreview = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Preview</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Displays previews of selected files with full control over rendering.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>

          <CodeBlock
            code={`import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/uplofile";

<UplofileRoot>
  <UplofileDropzone className="border p-4 rounded">
    <UplofileTrigger>Select files</UplofileTrigger>
    <UplofilePreview />
  </UplofileDropzone>
</UplofileRoot>`}
            language="tsx"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Render Props
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold">Prop</th>
                  <th className="text-left py-3 px-2 font-semibold">Type</th>
                  <th className="text-left py-3 px-2 font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">files</code>
                  </td>
                  <td className="py-3 px-2">FileItem[]</td>
                  <td className="py-3 px-2">Array of selected files</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">remove</code>
                  </td>
                  <td className="py-3 px-2">(file) =&gt; void</td>
                  <td className="py-3 px-2">Remove a file from selection</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">clear</code>
                  </td>
                  <td className="py-3 px-2">() =&gt; void</td>
                  <td className="py-3 px-2">Remove all files</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ComponentPreview;
