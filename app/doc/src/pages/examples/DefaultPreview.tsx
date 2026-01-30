import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import StyledDemo from "./DefaultPreview_Styled.demo.tsx";
import styledCode from "./DefaultPreview_Styled.demo.tsx?raw";
import UnstyledDemo from "./DefaultPreview_Unstyled.demo.tsx";
import unstyledCode from "./DefaultPreview_Unstyled.demo.tsx?raw";

const ExampleDefaultPreview = () => {
  const keyPoints = [
    <>Built-in <code className="code-inline">UplofilePreview</code> with polished default styling</>,
    <>Grid layout with aspect-ratio squares and hover overlays</>,
    <>Integrated progress bars, retry, and cancel actions</>,
    <>Custom <code className="code-inline">render</code> prop for a barebones, unstyled list</>,
  ];

  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Default & Unstyled Preview</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Compare the built-in styled preview with a completely unstyled custom render.
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
            Unstyled Preview (Custom Render)
          </h2>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm mb-4">
            <UnstyledDemo />
          </div>
          <CodeBlock language="tsx" code={unstyledCode} />
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
