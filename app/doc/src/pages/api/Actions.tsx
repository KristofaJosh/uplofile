import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {useUplofile} from "uplofile";

const ApiActions = () => {
  const { actions:{ cancel, remove, retry }, items, openFileDialog } = useUplofile();

  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Actions Reference</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Programmatic actions available via render props and hooks.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Available Actions
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-semibold">Action</th>
                  <th className="text-left py-3 px-2 font-semibold">Signature</th>
                  <th className="text-left py-3 px-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">add</code></td>
                  <td className="py-3 px-2">(files: File[]) =&gt; void</td>
                  <td className="py-3 px-2">Add files programmatically</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">remove</code></td>
                  <td className="py-3 px-2">(item: FileItem) =&gt; void</td>
                  <td className="py-3 px-2">Remove a specific file</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">clear</code></td>
                  <td className="py-3 px-2">() =&gt; void</td>
                  <td className="py-3 px-2">Remove all files</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-2"><code className="code-inline">open</code></td>
                  <td className="py-3 px-2">() =&gt; void</td>
                  <td className="py-3 px-2">Open the file picker</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Using the Hook
          </h2>
          
          <CodeBlock
            code={`
            import { useUplofile } from "uplofile";
            
            function CustomControls() {
              const {actions: {cancel, remove, retry}, items, openFileDialog} = useUplofile();
            
              return (
                  <div>
                    <button onClick={openFileDialog}>Open File</button>
                    <div>
                      {items.map((item) => {
                        return <div>
                          <div>{item.name}</div>
                          <button onClick={() => remove(item.uid)}>Remove</button>
                          {item.status === 'uploading' && <button onClick={() => cancel(item.uid)}>Retry</button>}
                          {item.status === 'error' && <button onClick={() => retry(item.uid)}>Retry</button>}
                        </div>
                      })}
                    </div>
                  </div>
              );
            }
            `}
            language="tsx"
          />
        </section>
      </article>
    </DocsLayout>
  );
};

export default ApiActions;
