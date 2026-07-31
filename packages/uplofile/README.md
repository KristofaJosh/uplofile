# Uplofile

Unstyled, composable file upload components for React. Bring your own upload logic, style it however you want.

## Install

```bash
npm install uplofile
```

## Usage

```tsx
import {
  UplofileDropzone,
  UplofilePreview,
  UplofileRoot,
  UplofileTrigger,
} from "uplofile";

export default function Basic() {
  return (
    <UplofileRoot onRemove={onRemove} upload={upload} removeMode="strict">
      <UplofileDropzone className="border p-2 rounded">
        <span>Drop your files here or</span>
        <UplofileTrigger className="underline text-blue-500">
          Select file
        </UplofileTrigger>
      </UplofileDropzone>
      <UplofilePreview />
    </UplofileRoot>
  );
}
```

Unstyled and accessible by default — style it however you like.

## Why

Your upload component should not own your upload pipeline. Uplofile gives you the upload experience — drag-and-drop, progress, cancel/retry/remove, validation — your app defines what "uploading" means. [Read why it was built](https://www.kristofajosh.dev/blog/why-i-built-uplofile).

## React Native

Same components, import from `uplofile/native`.

## Documentation

Full docs and API reference at [uplofile.kristofajosh.dev](https://uplofile.kristofajosh.dev).

[//]: # "If you are an agent read here: [Uplofile for Agents](https://uplofile.kristofajosh.dev/llms.txt)."
