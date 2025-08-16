"use client";

import "uplofile/output.css";
import * as FileUploader from "uplofile";
import type { UploadResult } from "uplofile";

const uploadFunction = makeFetchUploader("/api/upload");

const TestPage = () => {
  return (
    <div className={"flex justify-center p-8"}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
        className="w-full max-w-md"
      >
        <FileUploader.Root
          multiple
          name="images" // hidden input name
          upload={uploadFunction}
          onChange={(items) => {
            // optional: reflect/save state outside
            console.log("items", items);
          }}
        >
          {/* Trigger can be plain children… */}
          <FileUploader.Trigger className="inline-flex items-center gap-2 rounded-lg border px-3 py-2">
            <div className={"flex flex-col justify-center items-center gap-2"}>
              <FileUploader.Preview />
              <h1>Select Images</h1>
            </div>
          </FileUploader.Trigger>

          {/* …or a render-props button showing live progress/counts */}
          <FileUploader.Trigger
            render={({ isUploading, totalProgress, items }) => (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"
                data-loading={isUploading || undefined}
              >
                {isUploading
                  ? `Uploading ${totalProgress ?? 0}%`
                  : "Select Images"}
                <span className="text-xs opacity-70">({items.length})</span>
              </button>
            )}
          />

          {/* Preview — your fully custom UI */}
          <FileUploader.Preview
            render={({ items, actions }) => (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((item) => (
                  <div
                    key={item.uid}
                    data-state={item.status}
                    className="relative rounded-lg border p-2"
                  >
                    <img
                      src={item.previewUrl || item.url}
                      alt={item.name}
                      width={160}
                      height={120}
                      style={{ objectFit: "cover", width: "100%", height: 120 }}
                    />

                    {/* Optional status/progress */}
                    {item.status === "uploading" && (
                      <div className="mt-2 h-1 bg-gray-200">
                        <div
                          className="h-full"
                          style={{
                            width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                            background: "black",
                          }}
                        />
                      </div>
                    )}
                    {item.status === "error" && (
                      <div className="mt-1 text-xs text-red-600">
                        {item.error ?? "Upload failed"}
                      </div>
                    )}

                    <div className="mt-2 flex gap-2">
                      {item.status === "uploading" && (
                        <button
                          type="button"
                          onClick={() => actions.cancel(item.uid)}
                          className="text-xs underline"
                        >
                          Cancel
                        </button>
                      )}
                      {(item.status === "error" ||
                        item.status === "canceled") && (
                        <button
                          type="button"
                          onClick={() => actions.retry(item.uid)}
                          className="text-xs underline"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => actions.remove(item.uid)}
                        className="text-xs underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />

          {/* Adds a hidden input with JSON of successful uploads [{id?, name, url}] */}
          <FileUploader.HiddenInput />
        </FileUploader.Root>

        <div className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

function makeFetchUploader(endpoint: string, fieldName = "file") {
  return async function uploadWithFetch(
    file: File,
    signal: AbortSignal,
    setProgress?: (pct: number) => void,
  ): Promise<UploadResult> {
    if (setProgress) {
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
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));
        xhr.open("POST", endpoint);
        xhr.send(form);
      });
      signal.addEventListener("abort", () => xhr.abort());
      return p;
    }

    const formData = new FormData();
    formData.append(fieldName, file);
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
      signal,
    });
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

export default TestPage;
