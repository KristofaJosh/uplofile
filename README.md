### Uplofile

Composable file upload component for React. Build your own UI with small, accessible primitives: context-driven Root, Trigger, Dropzone, Preview, and helpers for cancel/retry/remove — with progress, drag-and-drop, and a hidden input for form posts.

- React 16+ compatible
- Drag & drop, click-to-upload, and render-props APIs
- Progress, cancel, retry, and optimistic/strict remove flows
- Hidden input with JSON of successful uploads for regular form submits
- Style however you like

---

### Installation

- npm: npm install uplofile
- yarn: yarn add uplofile
- pnpm: pnpm add uplofile

---

### Quick start

Client component (e.g. in Next.js add "use client"):

### 1) Minimal usage

The smallest working setup with a single button that opens the file picker.

```tsx
"use client";

import * as FileUploader from "uplofile";

export default function Basic() {
  return (
    <FileUploader.Root
      upload={async (file) => ({ url: URL.createObjectURL(file) })}
    >
      <FileUploader.Trigger>
        <button type="button">Select file</button>
      </FileUploader.Trigger>
    </FileUploader.Root>
  );
}
```

- Root sets up context and takes an `upload(file, signal, setProgress?)` function.
- Trigger opens the native file dialog.

---

### 2) Multiple files and a hidden input (form friendly)

Add `multiple` and a `name` so successful uploads are available as JSON in a hidden input for regular form posts.

```tsx
<FileUploader.Root multiple name="images" upload={upload}>
  <FileUploader.Trigger>
    <button type="button">Select images</button>
  </FileUploader.Trigger>
  <FileUploader.HiddenInput />
</FileUploader.Root>
```

- HiddenInput contains `[ { name, url, id? } ]` of successful uploads.

---

### 3) Providing a real upload function

Use fetch for a simple upload, or XHR to report progress. You can keep this in a separate module.

```ts
import type { UploadResult } from "uplofile";

export function makeFetchUploader(endpoint: string, fieldName = "file") {
  return async function upload(
    file: File,
    signal: AbortSignal,
    setProgress?: (pct: number) => void,
  ): Promise<UploadResult> {
    if (setProgress) {
      // XHR branch for progress
      const form = new FormData();
      form.append(fieldName, file);
      const xhr = new XMLHttpRequest();
      const p = new Promise<UploadResult>((resolve, reject) => {
        xhr.upload.onprogress = (evt) => {
          if (!evt.lengthComputable) return;
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              resolve({ url: json.url, id: json.id });
            } catch {
              resolve({ url: xhr.responseText });
            }
          } else reject(new Error(`Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));
        xhr.open("POST", endpoint);
        xhr.send(form);
      });
      signal.addEventListener("abort", () => xhr.abort());
      return p;
    }

    // Simple fetch (no progress)
    const form = new FormData();
    form.append(fieldName, file);
    const res = await fetch(endpoint, { method: "POST", body: form, signal });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    try {
      const json = await res.json();
      return { url: json.url, id: json.id };
    } catch {
      const text = await res.text();
      return { url: text };
    }
  };
}

export const upload = makeFetchUploader("/api/upload");
```

---

### 4) A nicer trigger with render props

Show live progress and counts without building a full preview.

```tsx
<FileUploader.Trigger
  render={({ isUploading, totalProgress, items }) => (
    <button type="button" data-loading={isUploading || undefined}>
      {isUploading ? `Uploading ${totalProgress ?? 0}%` : "Select images"}
      <span> ({items.length})</span>
    </button>
  )}
/>
```

- `isUploading`, `totalProgress`, and `items` come from context.

---

### 5) Custom preview UI with actions

Render thumbnails, a progress bar, and actions like cancel/retry/remove.

```tsx
<FileUploader.Preview
  render={({ items, actions }) => (
    <div className="grid">
      {items.map((item) => (
        <div key={item.uid} data-state={item.status}>
          <img src={item.previewUrl || item.url} alt={item.name} />

          {item.status === "uploading" && (
            <div>
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                }}
              />
            </div>
          )}

          {item.status === "error" && (
            <div>{item.error ?? "Upload failed"}</div>
          )}

          <div>
            {item.status === "uploading" && (
              <button type="button" onClick={() => actions.cancel(item.uid)}>
                Cancel
              </button>
            )}
            {(item.status === "error" || item.status === "canceled") && (
              <button type="button" onClick={() => actions.retry(item.uid)}>
                Retry
              </button>
            )}
            <button type="button" onClick={() => actions.remove(item.uid)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
/>
```

- `item` has fields like `uid, name, url?, previewUrl?, status, progress?, error?`.
- `actions` exposes `cancel(uid)`, `retry(uid)`, `remove(uid)`.

---

### 6) Drag-and-drop (Dropzone)

If your package includes a `Dropzone` primitive, surface it here. If not, you can skip this section.

```tsx
<FileUploader.Dropzone>
  <div>Drop files here or click to upload</div>
</FileUploader.Dropzone>
```

- Works alongside `Trigger`.

---

### 7) Putting it together (complete example)

A compact, end-to-end example using multiple files, custom trigger, preview, and a hidden input for form submit.

```tsx
"use client";
import "uplofile/output.css";
import * as FileUploader from "uplofile";
import { upload } from "./upload"; // from step 3

export default function Example() {
  return (
    <form className="max-w-md">
      <FileUploader.Root multiple name="images" upload={upload}>
        <FileUploader.Trigger
          render={({ isUploading, totalProgress, items }) => (
            <button type="button" data-loading={isUploading || undefined}>
              {isUploading
                ? `Uploading ${totalProgress ?? 0}%`
                : "Select Images"}
              <span> ({items.length})</span>
            </button>
          )}
        />

        <FileUploader.Preview /* custom UI as in step 5 */ />
        <FileUploader.HiddenInput />
      </FileUploader.Root>

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Styling

- Bring your own styles or Tailwind. The package includes a tiny CSS build with utility classes used by the default Preview.
- Import "uplofile/output.css".

---

### FAQ

- Can I limit the number of files? Use maxCount on Root.
- Can I prehydrate already-uploaded files? Pass initial=[{ id?, uid?, name, url }]. They’ll be shown as done and included in HiddenInput.
- How do I do strict server-side delete? Set removeMode="strict" and implement onRemove(item, signal).
- Do I have to use Tailwind? No. The components are unstyled besides minimal examples; you can render your own UI with the render props and actions.
