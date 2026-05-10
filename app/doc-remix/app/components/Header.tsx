import { Github, Package, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppIcon from "@/assets/icon.svg?react";
import { useState } from "react";
import { MobileNav } from "./MobileNav";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-10 items-center justify-center bg-muted text-foreground text-xs sm:text-sm">
          <div className="container flex items-center justify-center gap-2 px-4 text-center">
            <span className="truncate">
              Uplofile is open source
              <span className="hidden sm:inline">
                {" "}
                ... if it saves you time, star us on GitHub.
              </span>
            </span>
            <a
              href="https://github.com/KristofaJosh/uplofile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center rounded-md border border-border px-2 py-0.5 text-[11px] font-medium transition-colors hover:bg-background sm:text-xs"
            >
              Star on GitHub
            </a>
          </div>
        </div>
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center">
                <AppIcon />
              </div>
              <span className="text-lg font-semibold text-black">Uplofile</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/KristofaJosh/uplofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://www.npmjs.com/package/uplofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="npm"
                >
                  <Package className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
