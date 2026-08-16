import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { ImportLine } from "@/components/ImportLine";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./hiddeninput.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/components/hidden-input", [
    { title: "HiddenInput Component - Uplofile" },
    {
      name: "description",
      content: "HiddenInput carries completed upload data in a form field.",
    },
  ]);
const props: Prop[] = [
  {
    name: "name",
    signature: "string",
    description: (
      <>
        Field name posted with the form. Falls back to <code>Root</code>'s own{" "}
        <code>name</code> prop when omitted.
      </>
    ),
    default: '"image"',
  },
];

export default function ComponentHiddenInput() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>HiddenInput</h1>
        <p className="doc-lead">
          A single <code>{'<input type="hidden">'}</code> carrying completed
          items with URLs as JSON, for classic form posts that never touch{" "}
          <code>fetch</code>.
        </p>
        <ImportLine names="HiddenInput" />
        <section id="usage">
          <h2>Usage</h2>
          <p>
            Drop it anywhere inside <code>Root</code>. The value updates as
            uploads finish.
          </p>
          <CodeBlock code={code} filename="Uploader.tsx" />
        </section>
        <section id="props">
          <h2>Props</h2>
          <PropRows items={props} />
        </section>
        <div className="doc-pagination">
          <a href="/components/dropzone">
            <small>Previous</small>
            <span>Dropzone</span>
          </a>
          <a href="/api/props">
            <small>Next</small>
            <span>Types</span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
