import { IoArrowForwardOutline } from "react-icons/io5";
import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { CodeTabs } from "@/components/CodeTabs";
import { DocsLayout } from "@/components/DocsLayout";
import { ImportLine } from "@/components/ImportLine";
import { PropRows, type Prop } from "@/components/PropRow";
import minimal from "./root.demo.tsx?raw";
import withProgress from "./root.progress.demo.tsx?raw";
import strictRemove from "./root.strict.demo.tsx?raw";
import preHydrated from "./root.hydrated.demo.tsx?raw";
import refDemo from "./rootimperativeintro.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/components/root", [
    { title: "Root Component - Uplofile" },
    {
      name: "description",
      content:
        "The Root component manages upload state and provides context to its children.",
    },
  ]);

const props: Prop[] = [
  {
    name: "upload",
    required: true,
    signature: "(file, signal, setProgress?) => Promise<UploadResult>",
    description: (
      <>
        Your transport. Resolve with{" "}
        <code>{"{ url, id?, meta?, previewUrl? }"}</code>; throw to mark the
        item errored and enable retry.
      </>
    ),
  },
  {
    name: "removeMode",
    signature: '"optimistic" | "strict"',
    description: (
      <>
        Optimistic drops the item at once and restores it if{" "}
        <code>onRemove</code> rejects. Strict waits for the promise.
      </>
    ),
    default: '"optimistic"',
  },
  {
    name: "beforeUpload",
    signature:
      "(items, state) => boolean | Array<{ uid, valid, meta?, id?, reason? }>",
    description: (
      <>
        Gate or enrich files before transport. Async allowed. Return per-file
        verdicts to reject some and keep the rest; <code>state</code> carries{" "}
        <code>prevItems</code>, <code>remaining</code>, <code>maxCount</code>,
        and <code>accept</code>.
      </>
    ),
  },
  {
    name: "onRemove",
    signature: "(item, signal) => Promise<unknown>",
    description: (
      <>
        Server-side delete. Pair with <code>removeMode</code>.
      </>
    ),
  },
  {
    name: "initial",
    signature: "InitialItem[] | Promise<InitialItem[]>",
    description: (
      <>
        Files already on your server. Each item needs <code>uid</code>,{" "}
        <code>name</code>, and <code>url</code>; <code>id</code> and{" "}
        <code>meta</code> are optional.
      </>
    ),
    default: "[]",
  },
  {
    name: "onChange",
    signature: "(items: UploadFileItem[]) => void | Promise<void>",
    description: "Fires on every list change, where you can sync form state.",
  },
  {
    name: "onLoadingChange",
    signature: "(isLoading: boolean) => void",
    description: (
      <>
        True while <code>initial</code> is still resolving.
      </>
    ),
  },
  {
    name: [
      { name: "accept", signature: "string" },
      { name: "multiple", signature: "boolean" },
      { name: "maxCount", signature: "number" },
    ],
    description: (
      <>
        Passed straight to the file input. <code>maxCount</code> is also
        readable inside <code>beforeUpload</code>.
      </>
    ),
    default: ['"image/*"', "true", "—"],
  },
  {
    name: [
      { name: "name", signature: "string" },
      { name: "disabled", signature: "boolean" },
    ],
    description: (
      <>
        The field name for <code>HiddenInput</code>, and a blanket interaction
        lock.
      </>
    ),
    default: ['"image"', "false"],
  },
];

const refMethods: Prop[] = [
  { name: "getItems()", default: "read" },
  { name: "setItems(next)", default: "write" },
  { name: "onDrop(e)", default: "event" },
  { name: "onDragOver(e)", default: "event" },
  { name: "openFileDialog()", default: "action" },
  { name: "actions", default: "cancel · remove · retry" },
  { name: "isLoading", default: "boolean" },
];

export default function ComponentRoot() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Root</h1>
        <p className="doc-lead">
          Holds the file list and hands it to every child through context. One
          required prop: <code>upload</code>.
        </p>
        <ImportLine names="Root" />
        <section id="usage">
          <h2>Usage</h2>
          <p>
            Every variant below is the same component. Switch tabs to see what
            each prop changes.
          </p>
          <CodeTabs
            tabs={[
              { label: "minimal", code: minimal },
              { label: "with progress", code: withProgress },
              { label: "strict remove", code: strictRemove },
              { label: "pre-hydrated", code: preHydrated },
            ]}
          />
        </section>
        <section id="props">
          <h2>Props</h2>
          <PropRows items={props} />
        </section>
        <section id="ref">
          <h2>Ref API</h2>
          <p>
            A ref reaches the same methods from outside the context. It is how
            you make a whole page a drop target while children still read state.
          </p>
          <div className="ref-grid">
            <CodeBlock code={refDemo} filename="PageDropTarget.tsx" />
            <PropRows items={refMethods} />
          </div>
        </section>
        <div className="doc-pagination">
          <a href="/quick-start">
            <small>Previous</small>
            <span>Quick start</span>
          </a>
          <a href="/components/trigger">
            <small>Next</small>
            <span>
              Trigger <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
