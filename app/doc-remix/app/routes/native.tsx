import { usePostHog } from "@posthog/react";
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
        and resolves an empty array instead.
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
    required: true,
    signature: "(accept, { multiple }) => Promise<TFileSource[]>",
    description: (
      <>
        Opens your picker and resolves to the chosen files, or an
        empty array on cancel. Use one of the four adapters above, or write
        your own function of this shape.
      </>
    ),
  },
  {
    name: "onPickError",
    signature: "(error: unknown) => void",
    description: (
      <>
        Called when <code>pickFiles</code> rejects, for example on a denied
        permission. Cancelling is not an error: adapters resolve to an empty
        array. Without this prop, the error is logged with{" "}
        <code>console.warn</code>.
      </>
    ),
  },
];

const differences: Prop[] = [
  {
    name: "File source",
    description: (
      <>
        No DOM <code>File</code>. Every shared type is generic over{" "}
        <code>TFileSource</code> and infers it from whichever adapter you
        pass to <code>pickFiles</code>. Where it can&apos;t be inferred, it
        defaults to <code>NativeFile</code>:{" "}
        <code>{"{ uri, name?, type?, size? }"}</code>.
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
  const posthog = usePostHog();
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>React Native</h1>
        <p className="doc-lead">
          Same primitives, a second entry point. <code>uplofile/native</code>{" "}
          swaps the DOM file dialog for a picker you choose:{" "}
          <a
            href="https://www.npmjs.com/package/expo-image-picker"
            onClick={(event) =>
              posthog?.capture("outbound_click", {
                target: "npm",
                href: event.currentTarget.href,
                location: "Native",
              })
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>expo-image-picker</code>
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/expo-document-picker"
            onClick={(event) =>
              posthog?.capture("outbound_click", {
                target: "npm",
                href: event.currentTarget.href,
                location: "Native",
              })
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>expo-document-picker</code>
          </a>
          ,{" "}
          <a
            href="https://www.npmjs.com/package/react-native-image-picker"
            onClick={(event) =>
              posthog?.capture("outbound_click", {
                target: "npm",
                href: event.currentTarget.href,
                location: "Native",
              })
            }
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
            Native <code>Root</code> takes one extra, required prop,{" "}
            <code>pickFiles</code>. uplofile ships no picker and depends on
            none: you install the picker library you want and hand it to{" "}
            <code>Root</code> through an adapter.
          </p>
          <p className="doc-note">
            <strong>Upgrading from v3:</strong> the built-in{" "}
            <a
              href="https://www.npmjs.com/package/@react-native-documents/picker"
              onClick={(event) =>
                posthog?.capture("outbound_click", {
                  target: "npm",
                  href: event.currentTarget.href,
                  location: "Native",
                })
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <code>@react-native-documents/picker</code>
            </a>{" "}
            fallback and <code>suppressDeprecationWarnings</code> are gone. If
            you relied on the fallback, install that package and pass{" "}
            <code>pickFiles={"{adapterReactNativeDocumentsPicker(pick)}"}</code>
            . Import <code>NativeFile</code> where you used{" "}
            <code>DocumentPickerResponse</code> from <code>uplofile/native</code>
            . Types now default <code>file</code> to <code>NativeFile</code>,
            so if you read picker-only fields such as{" "}
            <code>nativeType</code> through <code>useUplofile()</code>, a{" "}
            <code>render</code> prop or the ref, pass the picker type:{" "}
            <code>{"useUplofile<any, DocumentPickerResponse>()"}</code>. A
            rejected <code>pickFiles</code> now reaches{" "}
            <code>onPickError</code> (or <code>console.warn</code>) instead of
            being dropped.
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
