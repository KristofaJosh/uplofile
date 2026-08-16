import { useState } from "react";
import type { MetaFunction } from "react-router";
import {
  IoArrowForwardOutline,
  IoCheckmark,
  IoCopyOutline,
} from "react-icons/io5";
import { CodeBlock } from "@/components/CodeBlock";
import { DocsLayout } from "@/components/DocsLayout";
import { useCopy } from "@/hooks/use-copy";
import uplofileConfigString from "@/components/ui/uplofile?raw";
import { withPageMeta } from "@/lib/seo";

const packages = {
  npm: "npm install uplofile",
  pnpm: "pnpm add uplofile",
  yarn: "yarn add uplofile",
  bun: "bun add uplofile",
};
const exports = [
  ["Root", "state + context"],
  ["Trigger", "opens the picker"],
  ["Dropzone", "drop target"],
  ["Preview", "the file list"],
  ["HiddenInput", "classic form post"],
  ["Cancel · Retry · Remove", "action buttons"],
  ["useUplofile()", "context hook"],
  ["isImageFile …", "helpers"],
];

export const meta: MetaFunction = () =>
  withPageMeta("/installation", [
    { title: "Installation — Uplofile" },
    {
      name: "description",
      content:
        "Install Uplofile and add its composable upload primitives to your React app.",
    },
  ]);

export default function Installation() {
  const [manager, setManager] = useState<keyof typeof packages>("npm");
  const [copied, copy] = useCopy();
  return (
    <DocsLayout>
      <article className="doc-article">
        <h1>Installation</h1>
        <p className="doc-lead">
          One dependency, no peer setup, no CSS import. React 16 and up.
        </p>
        <section id="install">
          <div className="install-tabs">
            <div className="install-tabs__bar">
              {(Object.keys(packages) as Array<keyof typeof packages>).map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={manager === item ? "is-active" : ""}
                    onClick={() => setManager(item)}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                className="install-tabs__copy"
                onClick={() => void copy(packages[manager])}
                aria-label="Copy installation command"
              >
                {copied ? (
                  <IoCheckmark size={14} />
                ) : (
                  <IoCopyOutline size={14} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>{packages[manager]}</pre>
          </div>
        </section>
        <section id="wrapper">
          <h2>Optional: a local wrapper</h2>
          <p>
            The exports are generic names. Most projects re-export them once
            with their own defaults so app code never repeats the upload
            function.
          </p>
          <CodeBlock
            code={uplofileConfigString}
            filename="src/components/uplofile.tsx"
          />
        </section>
        <section id="exports">
          <h2>What ships</h2>
          <div className="exports-grid">
            {exports.map(([name, detail]) => (
              <div key={name}>
                <code>{name}</code>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="doc-pagination">
          <span />
          <a href="/quick-start">
            <small>Next</small>
            <span>
              Quick start <IoArrowForwardOutline aria-hidden="true" size={14} />
            </span>
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
