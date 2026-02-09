import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import DeclarativeDemo from "./LoadingState_Declarative.demo.tsx";
import declarativeCode from "./LoadingState_Declarative.demo.tsx?raw";
import ImperativeDemo from "./LoadingState_Imperative.demo.tsx";
import imperativeCode from "./LoadingState_Imperative.demo.tsx?raw";
import FormDemo from "./LoadingState_Form.demo.tsx";
import formCode from "./LoadingState_Form.demo.tsx?raw";

const ExampleLoadingState = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">
          Loading State & Initial Hydration
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Use <code className="code-inline">isLoading</code> to wait for
          asynchronous
          <code className="code-inline">initial</code> files to hydrate before
          rendering UI or enabling actions. You can also subscribe imperatively
          via <code className="code-inline">ref.current.onLoadingChange</code>.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Declarative gating with isLoading
          </h2>
          <p className="text-muted-foreground">
            Render a skeleton while initial files are loading, then render your
            preview once hydration is complete.
          </p>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm mb-4">
            <DeclarativeDemo />
          </div>
          <CodeBlock language="tsx" code={declarativeCode} />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Imperative subscription via ref.onLoadingChange
          </h2>
          <p className="text-muted-foreground">
            Subscribe to loading changes using an imperative ref, and toggle
            your own UI state when hydration completes.
          </p>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm mb-4">
            <ImperativeDemo />
          </div>
          <CodeBlock language="tsx" code={imperativeCode} />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Form integration: disable submit until ready
          </h2>
          <p className="text-muted-foreground">
            Prevent premature form submission by disabling the submit button
            until initial files finish hydrating.
          </p>
          <div className="not-prose p-6 border border-border rounded-xl bg-muted/10 shadow-sm mb-4">
            <FormDemo />
          </div>
          <CodeBlock language="tsx" code={formCode} />
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleLoadingState;
