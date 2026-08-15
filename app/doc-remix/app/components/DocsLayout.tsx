import type { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import { Header } from "./Header";
import { DocsSidebar } from "./DocsSidebar";

const tocByPath: Record<string, Array<[string, string]>> = {
  "/installation": [
    ["#install", "Install"],
    ["#wrapper", "Local wrapper"],
    ["#exports", "What ships"],
  ],
  "/quick-start": [
    ["#file", "The file"],
    ["#next", "Next changes"],
  ],
  "/api/props": [
    ["#item", "UploadFileItem"],
    ["#status", "UploadStatus"],
    ["#result", "UploadResult"],
  ],
  "/api/actions": [
    ["#actions", "Item actions"],
    ["#ref", "Where you get them"],
    ["#hook", "Using the hook"],
  ],
  "/api/use-uplofile": [
    ["#signature", "Signature"],
    ["#context", "Context value"],
    ["#example", "Example"],
  ],
  "/components/root": [
    ["#usage", "Usage"],
    ["#props", "Props"],
    ["#ref", "Ref API"],
  ],
  "/components/trigger": [
    ["#usage", "Usage"],
    ["#render", "Render props"],
    ["#props", "Props"],
  ],
  "/components/preview": [
    ["#usage", "Usage"],
    ["#removal-errors", "Failed removals"],
    ["#render", "Render props"],
    ["#props", "Props"],
  ],
  "/components/dropzone": [
    ["#usage", "Usage"],
    ["#props", "Props"],
  ],
  "/components/hidden-input": [
    ["#usage", "Usage"],
    ["#props", "Props"],
  ],
};

export const DocsLayout = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const links =
    tocByPath[pathname] ??
    (pathname.startsWith("/examples/")
      ? [
          ["#preview", "Preview"],
          ["#code", "Code"],
        ]
      : undefined);

  return (
    <div className="docs-page">
      <Header />
      <div className="docs-shell">
        <DocsSidebar />
        <main className="docs-content">{children}</main>
        {links && (
          <aside className="docs-toc" aria-label="On this page">
            <span>On this page</span>
            {links.map(([href, title]) => (
              <a href={href} key={href}>
                {title}
              </a>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
};
