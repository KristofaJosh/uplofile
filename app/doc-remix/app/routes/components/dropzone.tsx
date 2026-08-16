import { IoArrowForwardOutline } from "react-icons/io5";
import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { ImportLine } from "@/components/ImportLine";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./dropzone.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/components/dropzone", [
    { title: "Dropzone Component - Uplofile" },
    {
      name: "description",
      content:
        "The Dropzone component provides a drag-and-drop area for file uploads.",
    },
  ]);
const props: Prop[] = [
  {
    name: "className",
    signature: "string",
    description: (
      <>
        A plain <code>{"<div>"}</code> by default. Style{" "}
        <code>data-dragging</code> for hover feedback: Dropzone tracks
        enter/leave counts so it stays accurate over nested children.
      </>
    ),
  },
  {
    name: "asChild",
    signature: "boolean",
    description:
      "Merge dropzone behavior onto your own element instead of rendering a div.",
    default: "false",
  },
  {
    name: "...rest",
    signature: "HTMLAttributes<HTMLElement>",
    description:
      "Any other div attribute. onDrop and onDragOver you pass are called first, then Uplofile's own handlers run unless you call preventDefault().",
  },
];

export default function ComponentDropzone() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Dropzone</h1>
        <p className="doc-lead">
          A drag-and-drop target. Unstyled: wrap whatever you already render and
          read <code>data-dragging</code> for the hover state.
        </p>
        <ImportLine names="Dropzone" />
        <section id="usage">
          <h2>Usage</h2>
          <CodeBlock code={code} filename="Uploader.tsx" />
        </section>
        <section id="props">
          <h2>Props</h2>
          <PropRows items={props} />
        </section>
        <div className="doc-pagination">
          <a href="/components/preview">
            <small>Previous</small>
            <span>Preview</span>
          </a>
          <a href="/components/hidden-input">
            <small>Next</small>
            <span>
              HiddenInput <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
