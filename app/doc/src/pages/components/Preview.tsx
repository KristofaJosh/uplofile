import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import code from "./Preview.demo.tsx?raw";

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

          <CodeBlock code={code} language="tsx" />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Default Behavior
          </h2>
          <p className="text-muted-foreground">
            By default, <code className="code-inline">UplofilePreview</code>{" "}
            renders a responsive grid of file cards with preview images, upload
            progress, and action buttons (Cancel, Retry, Remove).
          </p>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Default Preview
          </h2>
          <p className="text-muted-foreground">
            The default preview component provides a responsive grid layout with
            image thumbnails, progress bars, and action buttons.
          </p>
          <CodeBlock
            code={`<UplofilePreview />`}
            language="tsx"
          />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Custom Preview (No Styling)
          </h2>
          <p className="text-muted-foreground">
            If you want to build your own preview UI from scratch without any
            default styling, use the <code className="code-inline">render</code>{" "}
            prop.
          </p>
          <CodeBlock
            code={`<UplofilePreview
  render={({ items, actions }) => (
    <ul>
      {items.map((item) => (
        <li key={item.uid}>
          {item.name} - {item.status}
          <button onClick={() => actions.remove(item.uid)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )}
/>`}
            language="tsx"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Custom Rendering (Render Props)
          </h2>
          <p className="text-muted-foreground">
            Use the <code className="code-inline">render</code> prop to
            completely customize the preview UI. See the "Usage" example above
            for a live demonstration of custom rendering.
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
                  <td className="py-3 px-2"><code className="code-inline">items</code></td>
                  <td className="py-3 px-2">UploadFileItem[]</td>
                  <td className="py-3 px-2">Array of selected files</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">setItems</code></td>
                  <td className="py-3 px-2">(items) =&gt; void</td>
                  <td className="py-3 px-2">Function to update the items list</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">actions</code></td>
                  <td className="py-3 px-2">ItemActions</td>
                  <td className="py-3 px-2">
                    Actions to manage items (remove, retry, cancel)
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

export default ComponentPreview;
