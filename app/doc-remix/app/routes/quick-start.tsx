import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import quickStartDemo from "./quickstart.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/quick-start", [
    { title: "Quick start — Uplofile" },
    {
      name: "description",
      content: "Build a fully functional Uplofile uploader in one file.",
    },
  ]);

export default function QuickStart() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Quick start</h1>
        <p className="doc-lead">
          One file. Copy it, replace the fetch call, ship.
        </p>
        <section id="file">
          <CodeBlock code={quickStartDemo} filename="Uploader.tsx" />
        </section>
        <section id="next">
          <h2>Then change one thing at a time</h2>
          <div className="next-grid">
            <Link to="/examples/validation">
              <code>beforeUpload</code>
              <span>Reject files before they leave the browser</span>
            </Link>
            <Link to="/examples/default-preview">
              <code>render</code>
              <span>Replace the built-in preview with your own markup</span>
            </Link>
            <Link to="/components/hidden-input">
              <code>HiddenInput</code>
              <span>Post uploaded URLs with a normal form</span>
            </Link>
          </div>
        </section>
      </article>
    </DocsLayout>
  );
}
