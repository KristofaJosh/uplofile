# Uplofile

**Composable file‑upload components for React.**  
Accessible, unstyled primitives for building your own upload UI — with drag‑and‑drop, progress indicators, cancel/retry/remove actions, and an optional hidden input for classic form posts.

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

Import the primitives:

```typescript
import * as Uplofile from "uplofile";

const UplofileRoot = Uplofile.Root;

const UplofileTrigger = Uplofile.Trigger;

const UplofileHiddenInput = Uplofile.HiddenInput;

const UplofileDropzone = Uplofile.Dropzone;

const UplofilePreview = Uplofile.Preview;

const UplofileCancel = Uplofile.Cancel;

const UplofileRetry = Uplofile.Retry;

const UplofileRemove = Uplofile.Remove;

export {
  UplofileRoot,
  UplofileTrigger,
  UplofileHiddenInput,
  UplofileDropzone,
  UplofilePreview,
  UplofileCancel,
  UplofileRetry,
  UplofileRemove,
};

```

Then use them in your React component:
```tsx
"use client";

import {
    UplofileCancel,
    UplofileDropzone,
    UplofilePreview,
    UplofileRemove,
    UplofileRetry,
    UplofileRoot,
    UplofileTrigger,
} from "./components/ui/uplofile";

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
