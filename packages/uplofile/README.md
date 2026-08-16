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

By default, `Root` picks files with `@react-native-documents/picker`. Pass your own `pickFiles` prop to use a different picker instead — `Root` calls it in place of the built-in picker, and no other behavior changes:

```tsx
import { Root, Trigger, adapterExpoDocumentPicker } from "uplofile/native";
import * as DocumentPicker from "expo-document-picker";

export default function Basic() {
  return (
    <Root
      upload={upload}
      accept="image/*"
      multiple
      pickFiles={adapterExpoDocumentPicker(DocumentPicker.getDocumentAsync)}
    >
      <Trigger>Select file</Trigger>
    </Root>
  );
}
```

Four adapters are exported as named exports from `uplofile/native`, one per common picker. Each is a higher-order function — pass it the picker function you've already imported, and it returns a `pickFiles` implementation. None of the adapters import their corresponding picker package, so `uplofile`'s own dependency graph is unaffected no matter which adapters you use:

| Adapter | Wraps | Cancel / error convention |
| --- | --- | --- |
| `adapterReactNativeDocumentsPicker` | `@react-native-documents/picker`'s `pick()` | Throws on cancel (`err.code === "OPERATION_CANCELED"`) |
| `adapterExpoDocumentPicker` | `expo-document-picker`'s `getDocumentAsync()` | Resolves `{ canceled: true, assets: null }` on cancel |
| `adapterExpoImagePicker` | `expo-image-picker`'s `launchImageLibraryAsync()` | Resolves `{ canceled: true, assets: null }` on cancel |
| `adapterReactNativeImagePicker` | `react-native-image-picker`'s `launchImageLibrary()` | Resolves `{ didCancel: true }` on cancel; a returned `errorCode` is thrown as an `Error` (the package reports errors instead of throwing, and `pickFiles` has no side channel for a non-cancel failure) |

`adapterReactNativeDocumentsPicker` was verified against `@react-native-documents/picker`'s actual installed type definitions. `adapterExpoDocumentPicker`, `adapterExpoImagePicker`, and `adapterReactNativeImagePicker` were verified against each package's published type definitions (`expo-document-picker` v57.0.1, `expo-image-picker` v57.0.8, `react-native-image-picker` v8.2.1), but none of the three is installed in this repo or exercised against an actually-installed copy — verify their request/response shapes against the version you install before relying on them.

**`accept` is a no-op for the two image-picker adapters.** `accept` is uplofile's generic MIME/extension filter; the document-picker adapters honor it. `expo-image-picker` and `react-native-image-picker` wrap the OS photo picker, which only offers a media-category switch (images/videos), not MIME or extension filtering — there's no surface to forward `accept` into. `adapterExpoImagePicker` and `adapterReactNativeImagePicker` ignore `accept` and log a one-time, dev-only warning if you pass a non-image/video value, so the no-op isn't silent.

If you omit `pickFiles`, `Root` keeps working exactly as before — it falls back to `@react-native-documents/picker` — but logs a one-time deprecation warning per `Root` instance pointing at `pickFiles` and the adapters above. Pass `suppressDeprecationWarnings` to silence it. **This fallback, and the `@react-native-documents/picker` peer dependency it requires, will be removed in the next major version** — migrate to `pickFiles` (with an adapter, or your own implementation) when you're able to.

## Documentation

Full docs and API reference at [uplofile.kristofajosh.dev](https://uplofile.kristofajosh.dev).

[//]: # "If you are an agent read here: [Uplofile for Agents](https://uplofile.kristofajosh.dev/llms.txt)."
