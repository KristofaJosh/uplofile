import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppIcon from "@/assets/icon.svg?react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="container py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="space-y-8 animate-fade-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Uplofile
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Composable file upload components for React, accessible, and easy
              to integrate.
            </p>
            <p className="text-sm text-muted-foreground/90 max-w-lg">
              Actively maintained and constantly being improved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2" asChild>
                <a href="/installation">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a
                  href="https://github.com/KristofaJosh/uplofile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <a
              href="https://www.producthunt.com/products/uplofile?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-uplofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Uplofile on Product Hunt"
              className="inline-block"
            >
              <img
                alt="Uplofile - Composable accessible file upload components for React. | Product Hunt"
                width="250"
                height="54"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1083709&theme=light&t=1772028922471"
                loading="lazy"
              />
            </a>
          </div>

          <div className="flex justify-center max-w-2xl lg:justify-end animate-fade-up-delay-1">
            <div className="relative">
              <AppIcon className="hidden lg:block max-h-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
