import { IoArrowForwardOutline } from "react-icons/io5";
import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { ImportLine } from "@/components/ImportLine";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./preview.demo.tsx?raw";
import customCode from "./preview.custom.demo.tsx?raw";
import removalErrorCode from "./preview.removal-error.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/components/preview", [
    { title: "Preview Component - Uplofile" },
    {
      name: "description",
      content:
        "The Preview component displays selected files and upload controls.",
    },
  ]);
const renderProps: Prop[] = [
  {
    name: "items",
    signature: "UploadFileItem[]",
    description: "The current file list.",
  },
  {
    name: "isLoading",
    signature: "boolean",
    description: (
      <>
        True while <code>initial</code> is still resolving.
      </>
    ),
  },
  {
    name: "setItems",
    signature: "(items | updater) => void",
    description:
      "Replace the list directly. An escape hatch, not the usual path.",
  },
  {
    name: "actions",
    signature: "ItemActions",
    description: (
      <>
        <code>cancel</code>, <code>remove</code>, and <code>retry</code>: the
        same shape returned by <code>useUplofile()</code>.
      </>
    ),
  },
];
const props: Prop[] = [
  {
    name: "render",
    signature: "(api: PreviewRenderProps) => ReactNode",
    description: "Replace the built-in grid entirely. See render props below.",
  },
  {
    name: "className",
    signature: "string",
    description:
      "Appended to the built-in grid's wrapper. Ignored once render is set.",
  },
];

export default function ComponentPreview() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Preview</h1>
        <p className="doc-lead">
          Shows the file list. It ships a responsive grid with thumbnails,
          progress, and cancel/retry/remove—or hand it a <code>render</code>{" "}
          prop and own the markup yourself.
        </p>
        <ImportLine names="Preview" />
        <section id="usage">
          <h2>Usage</h2>
          <CodeBlock code={code} filename="Uploader.tsx" />
          <p>
            Pass <code>render</code> to skip the default grid and build your own
            list from the same state:
          </p>
          <CodeBlock code={customCode} filename="CustomPreview.tsx" />
        </section>
        <section id="removal-errors">
          <h2>Failed removals</h2>
          <p>
            If <code>onRemove</code> throws or rejects, the item stays (or is
            restored, in optimistic mode) at <code>status: "done"</code> with{" "}
            <code>error</code> set to the failure message. The built-in grid
            shows the same error badge and message it uses for a failed
            upload, and the file stays removable — no <code>render</code>{" "}
            prop or custom handling needed:
          </p>
          <CodeBlock code={removalErrorCode} filename="Uploader.tsx" />
        </section>
        <section id="render">
          <h2>Render props</h2>
          <p>
            Passed to <code>render</code> in place of the built-in grid.
          </p>
          <PropRows items={renderProps} />
        </section>
        <section id="props">
          <h2>Props</h2>
          <PropRows items={props} />
        </section>
        <div className="doc-pagination">
          <a href="/components/trigger">
            <small>Previous</small>
            <span>Trigger</span>
          </a>
          <a href="/components/dropzone">
            <small>Next</small>
            <span>
              Dropzone <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
