import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import code from "./Trigger.demo.tsx?raw";

const ComponentTrigger = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Trigger</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A clickable element that opens the file picker dialog.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>

          <CodeBlock code={code} language="tsx" />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            With Custom Element
          </h2>
          <p className="text-muted-foreground">
            Use <code className="code-inline">asChild</code> to render your own
            element:
          </p>

          <CodeBlock
            code={`<UplofileTrigger asChild>
  <button className="custom-button">
    <UploadIcon /> Upload files
  </button>
</UplofileTrigger>`}
            language="tsx"
          />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Render Props
          </h2>
          <p className="text-muted-foreground">
            You can use a function as children or the{" "}
            <code className="code-inline">render</code> prop to access internal
            state. See the "Usage" example above for a live demonstration of
            render props.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold">
                    Property
                  </th>
                  <th className="text-left py-3 px-2 font-semibold">Type</th>
                  <th className="text-left py-3 px-2 font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">items</code>
                  </td>
                  <td className="py-3 px-2">UploadFileItem[]</td>
                  <td className="py-3 px-2">Array of all file items</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">isUploading</code>
                  </td>
                  <td className="py-3 px-2">boolean</td>
                  <td className="py-3 px-2">Whether any file is uploading</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">uploadingCount</code>
                  </td>
                  <td className="py-3 px-2">number</td>
                  <td className="py-3 px-2">
                    Number of files currently uploading
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">doneCount</code>
                  </td>
                  <td className="py-3 px-2">number</td>
                  <td className="py-3 px-2">
                    Number of successfully uploaded files
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">errorCount</code>
                  </td>
                  <td className="py-3 px-2">number</td>
                  <td className="py-3 px-2">Number of failed uploads</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">totalProgress</code>
                  </td>
                  <td className="py-3 px-2">number | undefined</td>
                  <td className="py-3 px-2">
                    Average progress of all active uploads
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">open</code>
                  </td>
                  <td className="py-3 px-2">() =&gt; void</td>
                  <td className="py-3 px-2">
                    Function to open the file dialog
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Props
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
                    <code className="code-inline">asChild</code>
                  </td>
                  <td className="py-3 px-2">boolean</td>
                  <td className="py-3 px-2">Merge props onto child element</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">disabled</code>
                  </td>
                  <td className="py-3 px-2">boolean</td>
                  <td className="py-3 px-2">Disable the trigger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ComponentTrigger;
