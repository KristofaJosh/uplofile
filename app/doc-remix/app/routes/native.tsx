import { IoArrowForwardOutline } from "react-icons/io5";
import type { MetaFunction } from "react-router";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { ImportLine } from "@/components/ImportLine";
import { PropRows, type Prop } from "@/components/PropRow";
import code from "./native.demo.tsx?raw";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/native", [
    { title: "React Native — Uplofile" },
    {
      name: "description",
      content:
        "Uplofile's React Native entry point: Root, Trigger, Preview, and adapters that plug in the picker of your choice.",
    },
  ]);

const adapters: Prop[] = [
  {
    name: "adapterReactNativeDocumentsPicker",
    description: (
      <>
        Wraps <code>@react-native-documents/picker</code>&apos;s{" "}
        <code>pick()</code>. Catches its <code>OPERATION_CANCELED</code> throw
        and resolves an empty array instead. This is also the fallback{" "}
        <code>Root</code> uses when no <code>pickFiles</code> is given.
      </>
    ),
    default: "documents",
  },
  {
    name: "adapterExpoDocumentPicker",
    description: (
      <>
        Wraps <code>expo-document-picker</code>&apos;s{" "}
        <code>getDocumentAsync()</code>. This library resolves{" "}
        <code>{"{ canceled: true, assets: null }"}</code> on cancel rather
        than throwing. That&apos;s handled internally.
      </>
    ),
    default: "documents",
  },
  {
    name: "adapterExpoImagePicker",
    description: (
      <>
        Wraps <code>expo-image-picker</code>&apos;s{" "}
        <code>launchImageLibraryAsync()</code>. Image pickers filter by media
        category only, so a non-image/video <code>accept</code> is ignored,
        with a one-time dev warning.
      </>
    ),
    default: "images/video",
  },
  {
    name: "adapterReactNativeImagePicker",
    description: (
      <>
        Wraps <code>react-native-image-picker</code>&apos;s{" "}
        <code>launchImageLibrary()</code>. Translates its{" "}
        <code>{"{ errorCode, errorMessage }"}</code> failure shape into a
        thrown error; same ignored-<code>accept</code> warning as above.
      </>
    ),
    default: "images/video",
  },
];

const nativeProps: Prop[] = [
  {
    name: "pickFiles",
    signature: "(accept, { multiple }) => Promise<TFileSource[]>",
    description: (
      <>
        Replaces the built-in picker call. Use one of the four adapters
        above, or write your own function of this shape.
      </>
    ),
  },
  {
    name: "suppressDeprecationWarnings",
    signature: "boolean",
    description: (
      <>
        Temporarily silences the one-time warning logged when{" "}
        <code>pickFiles</code> is omitted and <code>Root</code> falls back
        to <code>@react-native-documents/picker</code>. It quiets the log,
        not the removal: that fallback is still going away in the next
        major version, so treat this as a stopgap while you migrate.
      </>
    ),
    default: "false",
  },
];

const differences: Prop[] = [
  {
    name: "File source",
    description: (
      <>
        No DOM <code>File</code>. Every shared type is generic over{" "}
        <code>TFileSource</code> and infers it from whichever adapter you
        pass to <code>pickFiles</code>.
      </>
    ),
  },
  {
    name: "No drag-and-drop",
    description: (
      <>
        <code>onDrop</code> / <code>onDragOver</code> are absent from the
        native <code>UplofileRootRef</code>. <code>Trigger</code> opens the
        picker instead.
      </>
    ),
  },
];

export default function Native() {
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>React Native</h1>
        <p className="doc-lead">
          Same primitives, a second entry point. <code>uplofile/native</code>{" "}
          swaps the DOM file dialog for a picker you choose:{" "}
          <a
            href="https://www.npmjs.com/package/expo-image-picker"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>expo-image-picker</code>
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/expo-document-picker"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>expo-document-picker</code>
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/react-native-image-picker"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>react-native-image-picker</code>
          </a>
          , or your own.
        </p>
        <ImportLine names="Root, Trigger, Preview" from="uplofile/native" />
        <section id="pickfiles">
          <h2>The picker is yours</h2>
          <p>
            Native <code>Root</code> takes one extra prop,{" "}
            <code>pickFiles</code>, invoked instead of a built-in call. If
            you omit it, <code>Root</code> falls back to{" "}
            <a
              href="https://www.npmjs.com/package/@react-native-documents/picker"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code>@react-native-documents/picker</code>
            </a>{" "}
            directly and logs a one-time deprecation warning. Pass{" "}
            <code>suppressDeprecationWarnings</code> to silence it if that
            fallback is intentional.
          </p>
          <p className="doc-note">
            <strong>Deprecated:</strong> this fallback, and the{" "}
            <code>@react-native-documents/picker</code> peer dependency it
            requires, will be removed in the next major version. Migrate to{" "}
            <code>pickFiles</code>, with an adapter above or your own
            implementation, when you&apos;re able to.
          </p>
          <CodeBlock code={code} filename="Uploader.native.tsx" />
        </section>
        <section id="adapters">
          <h2>Adapters</h2>
          <p>
            Four functions in <code>uplofile/native</code>, each wrapping one
            library&apos;s picker call into the shape <code>pickFiles</code>{" "}
            expects. Cancellation and per-library result shapes are handled
            for you.
          </p>
          <PropRows items={adapters} />
        </section>
        <section id="props">
          <h2>Root: native-only props</h2>
          <PropRows items={nativeProps} />
        </section>
        <section id="differences">
          <h2>What&apos;s different from web</h2>
          <PropRows items={differences} />
        </section>
        <div className="doc-pagination">
          <a href="/components/hidden-input">
            <small>Previous</small>
            <span>HiddenInput</span>
          </a>
          <a href="/api/props">
            <small>Next</small>
            <span>
              Types <IoArrowForwardOutline size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
