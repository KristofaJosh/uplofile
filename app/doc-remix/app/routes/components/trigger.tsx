import { IoArrowForwardOutline } from "react-icons/io5";
import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { ImportLine } from "@/components/ImportLine";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./trigger.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/components/trigger", [
    { title: "Trigger Component - Uplofile" },
    {
      name: "description",
      content: "The Trigger component opens the file picker dialog.",
    },
  ]);

const asChildExample = `<Trigger asChild>\n  <button className="custom-button">\n    <UploadIcon /> Upload files\n  </button>\n</Trigger>`;
const renderProps: Prop[] = [
  {
    name: "items",
    signature: "UploadFileItem[]",
    description: "Every item Root currently holds.",
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
    name: "isUploading",
    signature: "boolean",
    description: "True while at least one file is in flight.",
  },
  {
    name: "uploadingCount",
    signature: "number",
    description: "Files currently uploading.",
  },
  {
    name: "doneCount",
    signature: "number",
    description: "Files that finished successfully.",
  },
  { name: "errorCount", signature: "number", description: "Files that threw." },
  {
    name: "totalProgress",
    signature: "number | undefined",
    description: "Average progress across active uploads.",
  },
  {
    name: "open",
    signature: "() => void",
    description:
      "Opens the file picker. The same call the click handler makes.",
  },
];
const props: Prop[] = [
  {
    name: "asChild",
    signature: "boolean",
    description: (
      <>
        Merge trigger behavior onto your own child element instead of rendering
        a <code>{"<button>"}</code>.
      </>
    ),
    default: "false",
  },
  {
    name: "render",
    signature: "(api: TriggerRenderProps) => ReactNode",
    description: "Render from live upload state instead of children.",
  },
  {
    name: "children",
    signature: "ReactNode",
    description:
      "Button content. Use render when the content needs live upload state.",
  },
  {
    name: "...rest",
    signature: "HTMLAttributes<HTMLElement>",
    description: (
      <>
        Everything else is passed through. <code>disabled</code> comes from{" "}
        <code>{"<Root>"}</code>, not a Trigger prop.
      </>
    ),
  },
];

export default function ComponentTrigger() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Trigger</h1>
        <p className="doc-lead">
          A clickable element that opens the file picker. Renders a plain{" "}
          <code>{"<button>"}</code> unless you pass <code>asChild</code>.
        </p>
        <ImportLine names="Trigger" />
        <section id="usage">
          <h2>Usage</h2>
          <p>
            Use it as-is with children, or pass <code>render</code> to read live
            upload state.
          </p>
          <CodeBlock code={code} filename="Uploader.tsx" />
          <p>
            Use <code>asChild</code> to merge its click handler onto your own
            element instead:
          </p>
          <CodeBlock code={asChildExample} filename="Uploader.tsx" />
        </section>
        <section id="render">
          <h2>Render props</h2>
          <p>
            Passed to <code>render</code>, or available as the
            function-as-children form.
          </p>
          <PropRows items={renderProps} />
        </section>
        <section id="props">
          <h2>Props</h2>
          <PropRows items={props} />
        </section>
        <div className="doc-pagination">
          <a href="/components/root">
            <small>Previous</small>
            <span>Root</span>
          </a>
          <a href="/components/preview">
            <small>Next</small>
            <span>
              Preview <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
