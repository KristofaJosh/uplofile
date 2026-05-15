import type { MetaFunction } from "react-router";
import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import StyledDemo from "./defaultpreview_styled.demo.tsx";
import styledCode from "./defaultpreview_styled.demo.tsx?raw";
import CustomDemo from "./defaultpreview_custom.demo.tsx";
import customCode from "./defaultpreview_custom.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Default Preview Example - Uplofile" },
    { name: "description", content: "Example showing default file previews." },
  ];
};

const ExampleDefaultPreview = () => {
  const keyPoints = [
    <>
      Built-in <code className="code-inline">UplofilePreview</code> with
      polished default styling
    </>,
    <>Grid layout with aspect-ratio squares and hover overlays</>,
    <>Integrated progress bars, retry, and cancel actions</>,
    <>
      Custom <code className="code-inline">render</code> prop for intent-built
      preview rows
    </>,
  ];

  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Default & Custom Preview</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Compare the built-in preview with a custom render tailored to a
          compact file list.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Default Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm mb-4">
            <StyledDemo />
          </div>
          <CodeBlock language="tsx" code={styledCode} />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Custom Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm mb-4">
            <CustomDemo />
          </div>
          <CodeBlock language="tsx" code={customCode} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Key Points
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {keyPoints.map((point, i) => (
              <li key={i}>→ {point}</li>
            ))}
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleDefaultPreview;
