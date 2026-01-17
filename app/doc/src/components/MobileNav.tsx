import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { sidebarItems } from "./DocsSidebar";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r p-6 shadow-xl animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-bold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {sidebarItems.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-2">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors",
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};
