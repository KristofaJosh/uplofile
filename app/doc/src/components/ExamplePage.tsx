import { ReactNode } from "react";
import { DocsLayout } from "./DocsLayout";
import { CodeBlock } from "./CodeBlock";

interface ExamplePageProps {
  title: string;
  description: string;
  children: ReactNode;
  code: string;
  keyPoints: ReactNode[];
}

export const ExamplePage = ({
  title,
  description,
  children,
  code,
  keyPoints,
}: ExamplePageProps) => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm">
            {children}
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Code
          </h2>
          <CodeBlock language="tsx" code={code} />
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
