import React, { useState } from "react";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileHiddenInput,
} from "../ui/uplofile";
import { upload, onRemove } from "../../util/upload-simulator";

// Demonstrates using HiddenInput with a form and observing the JSON value
export default function ControlledFormExample() {
  const [submitted, setSubmitted] = useState(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setSubmitted(data.get("product.images"));
      }}
    >
      <div className="text-sm text-gray-600">Attach images to product</div>
      <UplofileRoot
        upload={upload}
        onRemove={onRemove}
        name="product.images"
        multiple
        accept="image/*"
      >
        <div className="flex items-center gap-3">
          <UplofileTrigger className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50">
            Add images
          </UplofileTrigger>
          {/*<UplofileHiddenInput />*/}
        </div>
        <div className="border rounded-xl p-3">
          <UplofilePreview />
        </div>
      </UplofileRoot>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50"
        >
          Submit form
        </button>
        {submitted && (
          <code className="text-xs text-gray-600 truncate">{submitted}</code>
        )}
      </div>
    </form>
  );
}
