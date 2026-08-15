import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import DeclarativeDemo from "./loadingstate_declarative.demo.tsx";
import declarativeCode from "./loadingstate_declarative.demo.tsx?raw";
import ImperativeDemo from "./loadingstate_imperative.demo.tsx";
import imperativeCode from "./loadingstate_imperative.demo.tsx?raw";
import FormDemo from "./loadingstate_form.demo.tsx";
import formCode from "./loadingstate_form.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/loading-state", [
    { title: "Loading State Example - Uplofile" },
    {
      name: "description",
      content: "Handling loading and progress states in Uplofile.",
    },
  ]);
};

const ExampleLoadingState = () => {
  return (
    <DocsLayout>
      <article className="doc-article recipe-article">
        <div className="breadcrumb">
          <span>Recipes</span>
          <span>›</span>
          <span>Loading state</span>
        </div>
        <h1>Loading state</h1>
        <p className="doc-lead">
          Wait for asynchronous initial files before rendering UI or enabling
          actions.
        </p>

        <section>
          <h2>Declarative gating</h2>
          <p>
            Render a skeleton while initial files are loading, then render your
            preview once hydration is complete.
          </p>
          <div className="recipe-preview">
            <DeclarativeDemo />
          </div>
          <CodeBlock language="tsx" code={declarativeCode} />
        </section>

        <section>
          <h2>Imperative subscription</h2>
          <p>
            Subscribe to loading changes using an imperative ref, and toggle
            your own UI state when hydration completes.
          </p>
          <div className="recipe-preview">
            <ImperativeDemo />
          </div>
          <CodeBlock language="tsx" code={imperativeCode} />
        </section>

        <section>
          <h2>Form integration</h2>
          <p>
            Prevent premature form submission by disabling the submit button
            until initial files finish hydrating.
          </p>
          <div className="recipe-preview">
            <FormDemo />
          </div>
          <CodeBlock language="tsx" code={formCode} />
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleLoadingState;
