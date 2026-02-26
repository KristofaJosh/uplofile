import { Layers3, ServerCog, ShieldCheck } from "lucide-react";

const principles = [
  {
    title: "React-first scope",
    icon: <Layers3 className="h-5 w-5" aria-hidden="true" />,
    description:
      "Uplofile focuses on UI state management, lifecycle orchestration, composable primitives, and predictable component behavior.",
  },
  {
    title: "Infrastructure stays in your app",
    icon: <ServerCog className="h-5 w-5" aria-hidden="true" />,
    description:
      "Transport strategy, backend choice, retries, and resumable protocol logic are infrastructure decisions, not component decisions.",
  },
  {
    title: "Accessible by default",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    description:
      "Build keyboard and screen-reader friendly upload experiences without sacrificing composition or design-system control.",
  },
];

export const PhilosophySection = () => {
  return (
    <section
      className="border-y border-border/70 bg-muted/20 py-20"
      aria-labelledby="philosophy-title"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Philosophy
          </p>
          <h2
            id="philosophy-title"
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Why Uplofile exists
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Upload complexity mostly lives in infrastructure. Uplofile is built
            around a simple idea: uploads are infrastructure concerns disguised
            as UI problems.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Instead of coupling upload mechanics to a specific engine, protocol,
            or backend, Uplofile gives you composable UI and lifecycle building
            blocks while your application defines what uploading means.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                {principle.icon}
              </div>
              <h3 className="text-lg font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Uplofile deliberately does not dictate how files are transported,
            which backend you use, which protocol you adopt, or how retries and
            resumable logic work. You bring your own upload logic.
          </p>
        </div>
      </div>
    </section>
  );
};
