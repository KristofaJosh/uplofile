import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";

const ComponentDropzone = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Dropzone</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A drag-and-drop zone for file uploads with visual feedback.
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
  <UplofileDropzone className="border-2 border-dashed p-8 rounded-lg">
    <span>Drop files here or </span>
    <UplofileTrigger className="underline text-blue-500">
      click to browse
    </UplofileTrigger>
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
                    <code className="code-inline">isDragging</code>
                  </td>
                  <td className="py-3 px-2">boolean</td>
                  <td className="py-3 px-2">
                    True when files are being dragged over the zone
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ComponentDropzone;
