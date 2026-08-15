import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";

export type SidebarItem = { title: string; href: string; badge?: string };
export type SidebarSection = {
  title: string;
  code?: boolean;
  items: SidebarItem[];
};

export const sidebarItems: SidebarSection[] = [
  {
    title: "Start",
    items: [
      { title: "Installation", href: "/installation" },
      { title: "Quick start", href: "/quick-start" },
      { title: "Playground", href: "/playground", badge: "live" },
    ],
  },
  {
    title: "Components",
    code: true,
    items: [
      { title: "Root", href: "/components/root" },
      { title: "Trigger", href: "/components/trigger" },
      { title: "Preview", href: "/components/preview" },
      { title: "Dropzone", href: "/components/dropzone" },
      { title: "HiddenInput", href: "/components/hidden-input" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Types", href: "/api/props" },
      { title: "Actions", href: "/api/actions" },
      { title: "useUplofile", href: "/api/use-uplofile" },
    ],
  },
  {
    title: "Recipes",
    items: [
      { title: "Basic uploader", href: "/examples/basic" },
      { title: "Dropzone", href: "/examples/dropzone" },
      { title: "Image gallery", href: "/examples/image-gallery" },
      { title: "Sortable gallery", href: "/examples/sortable-gallery" },
      { title: "Avatar", href: "/examples/avatar" },
      { title: "Video uploader", href: "/examples/video" },
      { title: "File list", href: "/examples/file-list" },
      { title: "Validation", href: "/examples/validation" },
      { title: "Form integration", href: "/examples/form" },
      { title: "Loading state", href: "/examples/loading-state" },
      { title: "Default preview", href: "/examples/default-preview" },
      { title: "Imperative control", href: "/examples/root-imperative" },
      { title: "Pause / resume", href: "/examples/pause-resume" },
      { title: "Batch upload", href: "/examples/batch-upload" },
    ],
  },
];

export const DocsSidebar = () => {
  const location = useLocation();
  return (
    <aside className="docs-sidebar">
      <nav aria-label="Documentation navigation">
        {sidebarItems.map((section) => (
          <section key={section.title} className="sidebar-section">
            <h2>{section.title}</h2>
            {section.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "sidebar-link",
                  section.code && "sidebar-link--code",
                  location.pathname === item.href && "sidebar-link--active",
                )}
              >
                <span>{item.title}</span>
                {item.badge && (
                  <small className="sidebar-link__badge">{item.badge}</small>
                )}
              </Link>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
};
