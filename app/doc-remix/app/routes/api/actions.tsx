import type { MetaFunction } from "react-router";
import { IoArrowForwardOutline } from "react-icons/io5";
import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./action.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () => {
  return withPageMeta("/api/actions", [
    { title: "Actions API - Uplofile" },
    {
      name: "description",
      content:
        "Learn about actions available for controlling Uplofile components programmatically.",
    },
  ]);
};

const itemActions: Prop[] = [
  {
    name: "cancel",
    signature: "(uid: string) => void",
    description:
      'Aborts an in-flight upload through its AbortSignal. The item then moves to "canceled".',
  },
  {
    name: "remove",
    signature: "(uid: string) => void",
    description: (
      <>
        Runs <code>onRemove</code> if you passed one, honoring{" "}
        <code>removeMode</code>; otherwise just drops the item.
      </>
    ),
  },
  {
    name: "retry",
    signature: "(uid: string) => void",
    description:
      "Calls upload() again for an item with a local file source, resetting progress to 0%. It is intended for errored or canceled uploads; pre-hydrated items have no local source.",
  },
];

const sources: Prop[] = [
  {
    name: "useUplofile()",
    signature: ".actions",
    description:
      "Anywhere inside Root. The usual way to build custom controls.",
  },
  {
    name: "<Preview render>",
    signature: "({ actions }) => …",
    description: "Scoped to the render prop, alongside items.",
  },
  {
    name: "<Root ref>",
    signature: ".actions",
    description: (
      <>
        From outside the context. See Root&rsquo;s{" "}
        <a href="/components/root#ref">Ref API</a>.
      </>
    ),
  },
];

const ApiActions = () => {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Actions</h1>
        <p className="doc-lead">
          Three verbs cover everything a file can do after it&rsquo;s selected.
          Every entry point below hands you the same shape.
        </p>

        <section id="actions">
          <h2>Item actions</h2>
          <p>
            Each takes the item&rsquo;s <code>uid</code>, not the item itself.
            Call <code>retry</code> only for items selected in this session;
            pre-hydrated items do not have a local file to upload again.
          </p>
          <PropRows items={itemActions} />
        </section>

        <section id="ref">
          <h2>Where you get them</h2>
          <PropRows items={sources} />
        </section>

        <section id="hook">
          <h2>Using the hook</h2>
          <p>
            <code>openFileDialog</code> ships alongside <code>actions</code> on
            the same context, so there&rsquo;s no separate import for the
            &quot;select files&quot; button.
          </p>
          <CodeBlock code={code} filename="CustomControls.tsx" />
        </section>

        <div className="doc-pagination">
          <a href="/api/props">
            <small>Previous</small>
            <span>Types</span>
          </a>
          <a href="/examples/simple-preview">
            <small>Next</small>
            <span>
              Examples <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
};

export default ApiActions;
