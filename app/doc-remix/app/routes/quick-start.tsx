import type { ComponentProps } from "react";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { CodeTabs } from "@/components/CodeTabs";
import { DocsLayout } from "@/components/DocsLayout";
import { mockUpload } from "@/lib/utils";
import Uploader from "./quickstart/Uploader";
import uploaderCode from "./quickstart/Uploader.tsx?raw";
import uploadCode from "./quickstart/upload.ts?raw";
import { withPageMeta } from "@/lib/seo";

const previewUpload: ComponentProps<typeof Uploader>["uploadFile"] = (
  file,
  signal,
  onProgress,
) => mockUpload(file, signal, onProgress, 0);

export const meta: MetaFunction = () =>
  withPageMeta("/quick-start", [
    { title: "Quick start — Uplofile" },
    {
      name: "description",
      content:
        "Build a Uplofile uploader with a live preview and two small files.",
    },
  ]);

export default function QuickStart() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Quick start</h1>
        <p className="doc-lead">
          Keep the upload request and the UI in separate files. Try the preview,
          then point the upload request at your endpoint.
        </p>
        <section id="preview">
          <div className="section-label">
            <span>Preview</span>
            <span>mock upload</span>
          </div>
          <div className="recipe-preview">
            <Uploader uploadFile={previewUpload} />
          </div>
        </section>
        <section id="code">
          <div className="section-label">
            <span>Code</span>
          </div>
          <CodeTabs
            tabs={[
              { label: "Uploader.tsx", code: uploaderCode },
              { label: "upload.ts", code: uploadCode },
            ]}
          />
        </section>
        <section id="next">
          <h2>Then change one thing at a time</h2>
          <div className="next-grid">
            <Link to="/examples/validation">
              <code>beforeUpload</code>
              <span>Reject files before they leave the browser</span>
            </Link>
            <Link to="/examples/simple-preview">
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
