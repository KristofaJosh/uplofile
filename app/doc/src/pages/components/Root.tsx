import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import code from "./Root.demo.tsx?raw";

const ComponentRoot = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Root</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The container component that manages file state and provides context
          to child components.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>

          <CodeBlock code={code} language="tsx" />
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
                  <th className="text-left py-3 px-2 font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">upload</code>
                  </td>
                  <td className="py-3 px-2">Function</td>
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    <strong>Required</strong>. Function that handles the file upload. 
                    Must return a Promise with <code className="code-inline">{`{ url: string, id?: string }`}</code>.
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">multiple</code>
                  </td>
                  <td className="py-3 px-2">boolean</td>
                  <td className="py-3 px-2">true</td>
                  <td className="py-3 px-2">Whether to allow multiple file selection</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">maxCount</code>
                  </td>
                  <td className="py-3 px-2">number</td>
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">Maximum number of files allowed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">accept</code>
                  </td>
                  <td className="py-3 px-2">string</td>
                  <td className="py-3 px-2">"image/*"</td>
                  <td className="py-3 px-2">
                    Accepted file types (HTML5 input accept attribute)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">initial</code>
                  </td>
                  <td className="py-3 px-2">Array</td>
                  <td className="py-3 px-2">[]</td>
                  <td className="py-3 px-2">
                    Pre-hydrated files from server
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">removeMode</code>
                  </td>
                  <td className="py-3 px-2">"optimistic" | "strict"</td>
                  <td className="py-3 px-2">"optimistic"</td>
                  <td className="py-3 px-2">
                    <strong>optimistic</strong>: UI updates immediately.<br/>
                    <strong>strict</strong>: UI waits for <code className="code-inline">onRemove</code> to resolve.
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">onChange</code>
                  </td>
                  <td className="py-3 px-2">(items) =&gt; void</td>
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    Called when the file list changes
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">onRemove</code>
                  </td>
                  <td className="py-3 px-2">(item, signal) =&gt; Promise</td>
                  <td className="py-3 px-2">-</td>
                  <td className="py-3 px-2">
                    Function to handle server-side file deletion
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">name</code>
                  </td>
                  <td className="py-3 px-2">string</td>
                  <td className="py-3 px-2">"images"</td>
                  <td className="py-3 px-2">
                    Name used for the hidden input field
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2">
                    <code className="code-inline">disabled</code>
                  </td>
                  <td className="py-3 px-2">boolean</td>
                  <td className="py-3 px-2">false</td>
                  <td className="py-3 px-2">
                    Disable all interactions
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

export default ComponentRoot;
