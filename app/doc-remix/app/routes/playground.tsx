import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type { MetaFunction } from "react-router";
import {
  IoCheckmark,
  IoCopyOutline,
  IoDocumentTextOutline,
  IoRefreshOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { DocsLayout } from "@/components/DocsLayout";
import { useCopy } from "@/hooks/use-copy";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  withPageMeta("/playground", [
    { title: "Playground - Uplofile" },
    {
      name: "description",
      content: "Try a simulated Uplofile uploader with real local files.",
    },
  ]);

type PlaygroundItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "done" | "canceled" | "error" | "removing";
};

const starterCode = `import { Root, Dropzone, Trigger, Preview } from "uplofile";

// simulated transport, tweak this to see failures
const FAIL_RATE = 0;

export default function Uploader() {
  return (
    <Root upload={upload} accept="image/*" multiple={true} maxCount={4} removeMode="optimistic">
      <Dropzone><Trigger>Select files</Trigger><Preview /></Dropzone>
    </Root>
  );
}`;

const formatSize = (size: number) =>
  size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;

function parseConfig(code: string) {
  const str = (key: string, fallback: string) =>
    code.match(new RegExp(`${key}\\s*=\\s*"([^"]*)"`))?.[1] ?? fallback;
  const num = (key: string, fallback: number) =>
    Number(
      code.match(new RegExp(`${key}\\s*=\\s*\\{\\s*([0-9.]+)\\s*\\}`))?.[1] ??
        fallback,
    );
  const bool = (key: string, fallback: boolean) =>
    code.match(new RegExp(`${key}\\s*=\\s*\\{\\s*(true|false)\\s*\\}`))?.[1] ===
      "true" ||
    (new RegExp(`<Root[^>]*\\s${key}[\\s/>]`).test(code) ? true : fallback);
  const failRate = Number(code.match(/FAIL_RATE\s*=\s*([0-9.]+)/)?.[1] ?? 0);
  return {
    accept: str("accept", "image/*"),
    multiple: bool("multiple", true),
    maxCount: num("maxCount", 0),
    removeMode: str("removeMode", "optimistic") as "optimistic" | "strict",
    failRate: Math.max(0, Math.min(1, failRate)),
  };
}

export default function Playground() {
  const [code, setCode] = useState(starterCode);
  const [items, setItems] = useState<PlaygroundItem[]>([]);
  const [notice, setNotice] = useState("");
  const [copied, copy] = useCopy();
  const timers = useRef<Record<string, number>>({});
  const config = useMemo(() => parseConfig(code), [code]);
  const finish = (id: string) => {
    window.clearInterval(timers.current[id]);
    delete timers.current[id];
  };
  useEffect(
    () => () => Object.values(timers.current).forEach(window.clearInterval),
    [],
  );

  const start = (item: PlaygroundItem) => {
    finish(item.id);
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? { ...entry, status: "uploading", progress: 0 }
          : entry,
      ),
    );
    timers.current[item.id] = window.setInterval(
      () =>
        setItems((current) =>
          current.map((entry) => {
            if (entry.id !== item.id || entry.status !== "uploading")
              return entry;
            const progress = Math.min(
              100,
              entry.progress + 4 + Math.random() * 11,
            );
            if (progress >= 100) {
              window.setTimeout(() => finish(item.id), 0);
              return {
                ...entry,
                progress,
                status: Math.random() < config.failRate ? "error" : "done",
              };
            }
            return { ...entry, progress };
          }),
        ),
      180,
    );
  };
  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!incoming.length) return;
    let allowed = incoming;
    let nextNotice = "";
    if (!config.multiple && incoming.length > 1) {
      nextNotice = `multiple is false, kept the first file, dropped ${incoming.length - 1}`;
      allowed = incoming.slice(0, 1);
    }
    if (config.maxCount > 0) {
      const room = Math.max(
        0,
        config.maxCount -
          items.filter((item) => item.status !== "canceled").length,
      );
      if (allowed.length > room) {
        nextNotice = `beforeUpload rejected ${allowed.length - room} file(s): maxCount is ${config.maxCount}`;
        allowed = allowed.slice(0, room);
      }
    }
    const added = allowed.map(
      (file, index): PlaygroundItem => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      }),
    );
    setItems((current) => (config.multiple ? [...current, ...added] : added));
    setNotice(nextNotice);
    added.forEach(start);
  };
  const remove = (id: string) => {
    finish(id);
    if (config.removeMode === "strict") {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: "removing" } : item,
        ),
      );
      window.setTimeout(
        () => setItems((current) => current.filter((item) => item.id !== id)),
        1100,
      );
    } else setItems((current) => current.filter((item) => item.id !== id));
  };
  const cancel = (id: string) => {
    finish(id);
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "canceled" } : item,
      ),
    );
  };
  const retry = (id: string) =>
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, progress: 0, status: "uploading" as const };
        window.setTimeout(() => start(next), 0);
        return next;
      }),
    );
  const statusLabel = (item: PlaygroundItem) =>
    item.status === "done"
      ? `done · ${formatSize(item.size)}`
      : item.status === "canceled"
        ? "canceled"
        : item.status === "error"
          ? "error · 500 upstream rejected"
          : item.status === "removing"
            ? "removing · waiting on server"
            : `${Math.round(item.progress)}% · uploading`;

  return (
    <DocsLayout>
      <article className="doc-article playground-article">
        <h1>Playground</h1>
        <p className="doc-lead">
          Edit the props on the left and the uploader on the right reconfigures.
          It takes real files from your disk against a simulated transport, so
          progress, cancel, retry, and both remove modes behave the way they
          will in your app.
        </p>
        <div className="playground-grid">
          <section id="editor" className="playground-card playground-editor">
            <header>
              <span>Uploader.tsx · editable</span>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setCode(starterCode);
                    setNotice("");
                  }}
                >
                  <IoRefreshOutline size={13} />
                  Reset
                </button>
                <button type="button" onClick={() => void copy(code)}>
                  {copied ? (
                    <IoCheckmark size={13} />
                  ) : (
                    <IoCopyOutline size={13} />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </header>
            <textarea
              aria-label="Editable Uploader.tsx example"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
            />
          </section>
          <section id="preview" className="playground-card playground-preview">
            <header>
              <span>running</span>
              <button
                type="button"
                onClick={() => {
                  Object.values(timers.current).forEach(window.clearInterval);
                  timers.current = {};
                  setItems([]);
                  setNotice("");
                }}
              >
                Clear
              </button>
            </header>
            <div className="playground-preview__body">
              <label className="outline-button">
                Select files
                <input
                  type="file"
                  hidden
                  multiple={config.multiple}
                  accept={config.accept}
                  onChange={onFiles}
                />
              </label>
              <span className="playground-count">
                {items.length
                  ? `${items.filter((item) => item.status === "done").length} of ${items.length} uploaded`
                  : config.maxCount
                    ? `up to ${config.maxCount}`
                    : "no limit"}
              </span>
              {notice && <div className="playground-notice">{notice}</div>}
              <div className="playground-list">
                {items.length === 0 ? (
                  <div className="playground-empty">No files yet</div>
                ) : (
                  items.map((item) => (
                    <div
                      className={`playground-row${item.status === "error" ? " is-error" : ""}`}
                      key={item.id}
                    >
                      <IoDocumentTextOutline size={16} />
                      <div className="playground-row__details">
                        <strong>{item.name}</strong>
                        <small>{statusLabel(item)}</small>
                        {item.status === "uploading" && (
                          <i>
                            <b style={{ width: `${item.progress}%` }} />
                          </i>
                        )}
                      </div>
                      {item.status === "uploading" && (
                        <button type="button" onClick={() => cancel(item.id)}>
                          Cancel
                        </button>
                      )}
                      {(item.status === "error" ||
                        item.status === "canceled") && (
                        <button type="button" onClick={() => retry(item.id)}>
                          Retry
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        disabled={item.status === "removing"}
                        onClick={() => remove(item.id)}
                      >
                        <IoCloseOutline size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="playground-config">
          <span>Parsed from your code</span>
          <code>accept={config.accept}</code>
          <code>multiple={String(config.multiple)}</code>
          <code>maxCount={config.maxCount || "—"}</code>
          <code>removeMode={config.removeMode}</code>
          <code>FAIL_RATE={config.failRate}</code>
        </div>
        <p className="playground-note">
          The transport here is a timer, not a network call. Raise{" "}
          <code>FAIL_RATE</code> above 0 to watch the error and retry path; set{" "}
          <code>removeMode</code> to <code>"strict"</code> to see a row hold in{" "}
          <code>"removing"</code> until the server answers.
        </p>
      </article>
    </DocsLayout>
  );
}
