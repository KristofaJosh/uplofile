# Uplofile

**Composable file upload components for React.**  
Accessible primitives for building your own upload UI — with drag‑and‑drop, progress, cancel/retry/remove, and hidden inputs for form posts.

---

## Features

- React 16+ compatible  
- Drag‑and‑drop or click‑to‑upload  
- Upload progress, cancel, retry, and remove  
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

---

## Documentation

Full docs, advanced usage, and examples are available on the [uplofile website](https://uplofile.kristofajosh.dev/).
