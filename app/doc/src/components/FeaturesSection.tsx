import { Pencil, Accessibility, Palette, BookOpen } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="mb-12 text-3xl font-bold tracking-tight">Examples</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard icon={<Pencil className="h-5 w-5" />} title="Composable" delay={0}>
            <p>
              Headless primitives — <code className="code-inline">Root</code>,{" "}
              <code className="code-inline">Trigger</code>,{" "}
              <code className="code-inline">Preview</code>,{" "}
              <code className="code-inline">Dropzone</code>,{" "}
              <code className="code-inline">HiddenInput</code> — so you can compose any UI while Uplofile handles state and actions.
            </p>
          </FeatureCard>

          <FeatureCard icon={<Accessibility className="h-5 w-5" />} title="Accessible" delay={100}>
            <p>
              Keyboard and screen-reader friendly. Works without drag-and-drop.
            </p>
          </FeatureCard>

          <FeatureCard icon={<Palette className="h-5 w-5" />} title="Stylable" delay={200}>
            <p>
              Unstyled by default. Use your own CSS, Tailwind, or design system; render-props give full control over markup, classes, and interactions.
            </p>
          </FeatureCard>

          <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="Read the docs" delay={300}>
            <p>
              Learn more in{" "}
              <a 
                href="/installation" 
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                the uplofile docs
              </a>.
            </p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};
