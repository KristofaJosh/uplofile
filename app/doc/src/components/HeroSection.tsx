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
