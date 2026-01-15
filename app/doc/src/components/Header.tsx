import { Github, Package, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppIcon from "@/assets/icon.svg?react";
import { useState } from "react";
import { MobileNav } from "./MobileNav";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <a href="https://github.com/KristofaJosh/uplofile" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.npmjs.com/package/uplofile" target="_blank" rel="noopener noreferrer" aria-label="npm">
                <Package className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};