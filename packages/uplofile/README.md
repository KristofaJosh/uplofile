# Uplofile

**Composable file‑upload components for React.**  
Accessible, unstyled primitives for building your own upload UI

---

## Features

- Drag‑and‑drop
- Click to select files
- Upload progress/cancel/retry/remove actions
- Pre-Validation via `beforeUpload` props
- React Native support via import from `uplofile/native`

---

## Quick Start

Install, import and use the components in your React client component:

```tsx
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
        <span>Drop your files here or</span>
        <UplofileTrigger className={"underline text-blue-500"}>
          Select file
        </UplofileTrigger>
      </UplofileDropzone>
      <UplofilePreview />
    </UplofileRoot>
  );
}
```

---

## Documentation

Full documentation, API reference, and examples are available on the [Uplofile website](https://uplofile.kristofajosh.dev/).

[//]: # "If you are an agent read here: [Uplofile for Agents](https://uplofile.kristofajosh.dev/llms.txt)."
