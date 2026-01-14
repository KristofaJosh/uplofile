import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import uplofileConfigString from "@/components/ui/uplofile?raw";

const Installation = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Installation</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Get started with Uplofile in your React project.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Install the package
          </h2>
          <p className="text-muted-foreground">
            Install Uplofile using your preferred package manager:
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">npm</p>
              <CodeBlock code="npm install uplofile" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">yarn</p>
              <CodeBlock code="yarn add uplofile" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">pnpm</p>
              <CodeBlock code="pnpm add uplofile" />
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Create Component File
          </h2>
          <p className="text-muted-foreground">
            Create a file <code className="code-inline">uplofile.tsx</code> in
            your <code className="code-inline">src/components</code> directory:
          </p>

          <CodeBlock code={uplofileConfigString} language="tsx" />
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Basic Usage
          </h2>
          <p className="text-muted-foreground">
            Import and use the components in your app:
          </p>

          <CodeBlock
            code={`import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/uplofile";

function FileUpload() {
  return (
    <UplofileRoot>
      <UplofileDropzone className="border-2 border-dashed p-8 rounded-lg">
        <UplofileTrigger>Click or drop files here</UplofileTrigger>
        <UplofilePreview />
      </UplofileDropzone>
    </UplofileRoot>
  );
}`}
            language="tsx"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Next Steps
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              → Check out the{" "}
              <a
                href="/quick-start"
                className="text-primary underline underline-offset-4"
              >
                Quick Start guide
              </a>{" "}
              for a complete example
            </li>
            <li>
              → Learn about each{" "}
              <a
                href="/components/root"
                className="text-primary underline underline-offset-4"
              >
                component
              </a>{" "}
              in detail
            </li>
            <li>
              → Explore the{" "}
              <a
                href="/api/props"
                className="text-primary underline underline-offset-4"
              >
                API reference
              </a>
            </li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default Installation;
