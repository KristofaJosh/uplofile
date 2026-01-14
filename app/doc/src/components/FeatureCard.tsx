import { PropsWithChildren, ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  delay?: number;
}

export const FeatureCard = ({
  icon,
  title,
  children,
  delay = 0,
}: PropsWithChildren<Props>) => {
  return (
    <div
      className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
};
