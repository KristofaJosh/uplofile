import { IoArrowForwardOutline } from "react-icons/io5";
import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./use-uplofile.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/api/use-uplofile", [
    { title: "useUplofile Hook - Uplofile" },
    {
      name: "description",
      content:
        "Reference for the useUplofile hook and the uploader context it returns.",
    },
  ]);

const signature = `function useUplofile<TMeta = any, TFileSource = unknown>(): {
  items: UploadFileItem<TMeta, TFileSource>[];
  setItems: (items | updater) => void;
  isLoading: boolean;
  disabled?: boolean;
  multiple: boolean;
  accept: string;
  actions: ItemActions;
  openFileDialog: () => void;
  fileInputProps: Record<string, any>;
  getDropzoneProps: () => Record<string, any>;
  hiddenInputValue: string;
  name: string;
};

// Throws if called outside <Root>.`;

const context: Prop[] = [
  {
    name: "items",
    signature: "UploadFileItem<TMeta, TFileSource>[]",
    description:
      "The full list: idle, uploading, done, error, canceled, or removing.",
  },
  {
    name: "setItems",
    signature: "(items | updater) => void",
    description:
      "Replace the list directly. This is an escape hatch; actions cover the usual file operations.",
  },
  {
    name: "isLoading",
    signature: "boolean",
    description: (
      <>
        True while <code>initial</code> is resolving.
      </>
    ),
  },
  {
    name: "disabled",
    signature: "boolean | undefined",
    description: "Mirrors Root’s disabled prop.",
  },
  {
    name: [
      { name: "multiple", signature: "boolean" },
      { name: "accept", signature: "string" },
    ],
    description:
      "The resolved Root options. Read them instead of duplicating configuration in custom UI.",
  },
  {
    name: "actions",
    signature: "ItemActions",
    description: (
      <>
        See the <a href="/api/actions">Actions</a> reference.
      </>
    ),
  },
  {
    name: "openFileDialog",
    signature: "() => void",
    description:
      "What Trigger calls under the hood. Use it to build a custom trigger.",
  },
  {
    name: "fileInputProps",
    signature: "Record<string, any>",
    description:
      "Props for a native file input when you need to render one yourself.",
  },
  {
    name: "getDropzoneProps",
    signature: "() => Record<string, any>",
    description:
      "Returns the keyboard and drag-and-drop props used by Dropzone.",
  },
  {
    name: "hiddenInputValue",
    signature: "string",
    description: (
      <>
        The JSON string <code>HiddenInput</code> renders, if you need it
        elsewhere.
      </>
    ),
  },
  {
    name: "name",
    signature: "string",
    description: "Root’s resolved hidden-field name.",
  },
];

export default function ApiUseUplofile() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>useUplofile</h1>
        <p className="doc-lead">
          Reads the same context every child component subscribes to. Call it
          inside <code>{"<Root>"}</code> to build custom UI without prop
          drilling.
        </p>

        <section id="signature">
          <h2>Signature</h2>
          <CodeBlock
            code={signature}
            filename="uplofile/hook.ts"
            language="ts"
          />
        </section>

        <section id="context">
          <h2>Context value</h2>
          <p>
            Everything Trigger, Dropzone, and Preview read is available here
            too.
          </p>
          <PropRows items={context} />
        </section>

        <section id="example">
          <h2>Example</h2>
          <CodeBlock code={code} filename="UploadSummary.tsx" />
        </section>

        <div className="doc-pagination">
          <a href="/api/actions">
            <small>Previous</small>
            <span>Actions</span>
          </a>
          <a href="/examples/basic">
            <small>Next</small>
            <span>
              Basic uploader <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
