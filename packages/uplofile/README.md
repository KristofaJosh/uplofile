# Uplofile

**Composable file‑upload components for React.**  
Accessible, unstyled primitives for building your own upload UI — with drag‑and‑drop, progress indicators, cancel/retry/remove actions, and an optional hidden input for classic form posts.

<a href="https://www.producthunt.com/products/uplofile?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-uplofile" target="_blank" rel="noopener noreferrer"><img alt="Uplofile - Composable accessible file upload components for React. | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1083709&theme=light&t=1772028922471"></a>

---

## Features

- React 16+ compatible
- Drag‑and‑drop or click‑to‑upload
- Upload progress, plus cancel/retry/remove actions
- **Custom Validation:** Use `beforeUpload` to validate files before they start uploading
- Hidden input for form submissions
- Unstyled — bring your own design

---

## Installation

```bash
npm install uplofile
# or
yarn add uplofile
# or
pnpm add uplofile
```

---

## Quick Start

Import and use the components in your React component:

```tsx
"use client";

import {
  UplofileDropzone,
  UplofilePreview,
  UplofileRoot,
  UplofileTrigger,
} from "uplofile";

export default function Basic() {
  return (
    <UplofileRoot onRemove={onRemove} upload={upload} removeMode={"strict"}>
      <UplofileDropzone className={"border p-2 rounded"}>
        <span>Drop your files here or</span>{" "}
        <UplofileTrigger className={"underline text-blue-500"}>
          Select file
        </UplofileTrigger>
        <div className={"border-t my-6 py-6"}>
          <UplofilePreview />
        </div>
      </UplofileDropzone>
    </UplofileRoot>
  );
}
```

---

## Documentation

Full documentation, API reference, and examples are available on the [Uplofile website](https://uplofile.kristofajosh.dev/).
