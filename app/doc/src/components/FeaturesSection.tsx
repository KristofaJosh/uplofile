import { useMemo, useState } from "react";
import { Pencil, Accessibility, Palette, BookOpen } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import BasicUploaderDemo from "@/pages/examples/BasicUploader.demo";
import DropzoneUploaderDemo from "@/pages/examples/DropzoneUploader.demo";
import AvatarUploaderDemo from "@/pages/examples/AvatarUploader.demo";

export const FeaturesSection = () => {
  const examples = useMemo(
    () => [
      {
        id: "basic",
        label: "Basic",
        description: "Minimal uploader with a clean file list.",
        component: <BasicUploaderDemo />,
      },
      {
        id: "dropzone",
        label: "Dropzone",
        description: "Drag-and-drop flow with progress feedback.",
        component: <DropzoneUploaderDemo />,
      },
      {
        id: "avatar",
        label: "Avatar",
        description: "Single image upload with a polished preview state.",
        component: <AvatarUploaderDemo />,
      },
    ],
    [],
  );
  const [activeExampleId, setActiveExampleId] = useState(examples[0].id);
  const activeExample = examples.find((example) => example.id === activeExampleId);

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold tracking-tight">Examples</h2>
        <div className="mb-12 rounded-2xl border border-border bg-card/40 p-4 md:p-6">
          <div
            role="tablist"
            aria-label="Example previews"
            className="mb-4 flex flex-wrap gap-2"
          >
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                role="tab"
                aria-selected={activeExampleId === example.id}
                aria-controls={`example-panel-${example.id}`}
                id={`example-tab-${example.id}`}
                onClick={() => setActiveExampleId(example.id)}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  activeExampleId === example.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>

          {activeExample && (
            <div
              role="tabpanel"
              id={`example-panel-${activeExample.id}`}
              aria-labelledby={`example-tab-${activeExample.id}`}
              className="rounded-xl border border-border bg-background p-4 md:p-6"
            >
              <p className="mb-5 text-sm text-muted-foreground">
                {activeExample.description}
              </p>
              {activeExample.component}
            </div>
          )}

          <div className="mt-4 text-sm">
            <a
              href="/examples/basic"
              className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              View all examples
            </a>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={<Pencil className="h-5 w-5" />}
            title="Composable"
            delay={0}
          >
            <p>
              Headless primitives — <code className="code-inline">Root</code>,{" "}
              <code className="code-inline">Trigger</code>,{" "}
              <code className="code-inline">Preview</code>,{" "}
              <code className="code-inline">Dropzone</code>,{" "}
              <code className="code-inline">HiddenInput</code> — so you can
              compose any UI while Uplofile handles state and actions.
            </p>
          </FeatureCard>

          <FeatureCard
            icon={<Accessibility className="h-5 w-5" />}
            title="Accessible"
            delay={100}
          >
            <p>
              Keyboard and screen-reader friendly. Works without drag-and-drop.
            </p>
          </FeatureCard>

          <FeatureCard
            icon={<Palette className="h-5 w-5" />}
            title="Stylable"
            delay={200}
          >
            <p>
              Unstyled by default. Use your own CSS, Tailwind, or design system;
              render-props give full control over markup, classes, and
              interactions.
            </p>
          </FeatureCard>

          <FeatureCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Read the docs"
            delay={300}
          >
            <p>
              Learn more in{" "}
              <a
                href="/installation"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                the uplofile docs
              </a>
              .
            </p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};
