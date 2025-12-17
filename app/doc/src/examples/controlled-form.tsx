import React, { useState } from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileHiddenInput,
} from "@/components/ui/uplofile.ts";
import { upload, onRemove } from "@/utils/upload-simulator";

export default function ControlledFormExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const filesJson = data.get("product-images");
        setSubmitted(filesJson ? String(filesJson) : "[]");
      }}
    >
      <UplofileRoot
        name="product-images"
        multiple
        upload={upload}
        onRemove={onRemove}
      >
        <div className="flex items-center gap-2">
          <UplofileTrigger className="rounded-lg border px-3 py-2">
            Add images
          </UplofileTrigger>
        </div>
        <UplofilePreview />
        <UplofileHiddenInput />
      </UplofileRoot>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Submit
        </button>
      </div>

      {submitted && (
        <pre className="mt-4 overflow-auto rounded-lg border bg-gray-50 p-3 text-xs dark:bg-neutral-900">
{submitted}
        </pre>
      )}
    </form>
  );
}
