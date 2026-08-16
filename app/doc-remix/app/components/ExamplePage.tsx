import type { ReactNode } from "react";
import { DocsLayout } from "./DocsLayout";
import { CodeBlock } from "./CodeBlock";
import { CodeTabs, type CodeTab } from "./CodeTabs";

export interface ExamplePageProps {
  title: string;
  description: string;
  children: ReactNode;
  code?: string;
  codeTabs?: CodeTab[];
  keyPoints: ReactNode[];
}

export const ExamplePage = ({
  title,
  description,
  children,
  code,
  codeTabs,
  keyPoints,
}: ExamplePageProps) => {
  return (
    <DocsLayout>
      <article className="doc-article recipe-article">
        <div className="breadcrumb">
          <span>Recipes</span>
          <span>›</span>
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        <p className="doc-lead">{description}</p>

        <section id="preview">
          <div className="section-label">
            <span>Preview</span>
            <span>mock transport</span>
          </div>
          <div className="recipe-preview">{children}</div>
        </section>

        <section id="code">
          <div className="section-label">
            <span>Code</span>
          </div>
          {codeTabs && codeTabs.length > 0 ? (
            <CodeTabs tabs={codeTabs} />
          ) : (
            <CodeBlock
              language="tsx"
              code={code ?? ""}
              filename={`${title.replace(/\s+/g, "")}.tsx`}
            />
          )}
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
