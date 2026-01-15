import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Installation", href: "/installation" },
      { title: "Quick Start", href: "/quick-start" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Root", href: "/components/root" },
      { title: "Trigger", href: "/components/trigger" },
      { title: "Preview", href: "/components/preview" },
      { title: "Dropzone", href: "/components/dropzone" },
      { title: "HiddenInput", href: "/components/hidden-input" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Props", href: "/api/props" },
      { title: "Actions", href: "/api/actions" },
    ],
  },
  {
    title: "Examples",
    items: [
      { title: "Basic Uploader", href: "/examples/basic" },
      { title: "Dropzone", href: "/examples/dropzone" },
      { title: "Image Gallery", href: "/examples/image-gallery" },
      { title: "Avatar Uploader", href: "/examples/avatar" },
      { title: "File List with Actions", href: "/examples/file-list" },
      { title: "Video Uploader", href: "/examples/video" },
      { title: "Form Integration", href: "/examples/form" },
    ],
  },
];

export const DocsSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 space-y-6">
        {sidebarItems.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold text-sm mb-2">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block text-sm py-1.5 px-3 rounded-md transition-colors",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
    </aside>
  );
};
