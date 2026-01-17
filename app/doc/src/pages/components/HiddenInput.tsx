import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import code from "./HiddenInput.demo.tsx?raw";

const ComponentHiddenInput = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">HiddenInput</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A hidden input that holds file data for form submissions.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>
          <p className="text-muted-foreground">
            Include this component to make files available in form submissions:
          </p>

          <CodeBlock code={code} language="tsx" />
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
                    <code className="code-inline">name</code>
                  </td>
                  <td className="py-3 px-2">string</td>
                  <td className="py-3 px-2">
                    Form field name. If not provided, it uses the{" "}
                    <code className="code-inline">name</code> from{" "}
                    <code className="code-inline">UplofileRoot</code>.
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

export default ComponentHiddenInput;
