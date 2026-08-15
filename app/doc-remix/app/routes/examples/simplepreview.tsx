import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import StyledDemo from "./simplepreview_styled.demo.tsx";
import styledCode from "./simplepreview_styled.demo.tsx?raw";
import CustomDemo from "./simplepreview_custom.demo.tsx";
import customCode from "./simplepreview_custom.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/simple-preview", [
    { title: "Simple Preview Example - Uplofile" },
    { name: "description", content: "Example showing default file previews." },
  ]);
};

const ExampleSimplePreview = () => {
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
      <article className="doc-article recipe-article">
        <div className="breadcrumb">
          <span>Recipes</span>
          <span>›</span>
          <span>Simple preview</span>
        </div>
        <h1>Simple preview</h1>
        <p className="doc-lead">
          Compare the built-in preview with a completely unstyled custom render.
        </p>

        <section className="space-y-4 mb-12">
          <div className="section-label">
            <span>Built-in preview</span>
            <span>mock transport</span>
          </div>
          <div className="recipe-preview">
            <StyledDemo />
          </div>
          <CodeBlock
            language="tsx"
            code={styledCode}
            filename="SimplePreview.tsx"
          />
        </section>

        <section className="space-y-4 mb-12">
          <div className="section-label">
            <span>Custom render</span>
          </div>
          <div className="recipe-preview">
            <CustomDemo />
          </div>
          <CodeBlock
            language="tsx"
            code={customCode}
            filename="CustomPreview.tsx"
          />
        </section>

        <section className="recipe-notes">
          <h2>Notes</h2>
          <ul>
            {keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleSimplePreview;
