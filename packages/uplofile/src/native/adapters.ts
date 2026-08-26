import { acceptsFile, getNativePickerAcceptTypes } from "../shared/utils";
import type { PickFilesFn } from "../shared/types";

/**
 * Reads the RN global set by Metro (`__DEV__`) without depending on
 * `@types/react-native`'s ambient declarations, falling back to
 * `process.env.NODE_ENV` for non-RN test/bundler environments.
 */
const isDevEnvironment = (): boolean => {
  const g = globalThis as {
    __DEV__?: boolean;
    process?: { env?: { NODE_ENV?: string } };
  };
  if (typeof g.__DEV__ === "boolean") return g.__DEV__;
  return g.process?.env?.NODE_ENV !== "production";
};

const isImageOrVideoAccept = (accept: string | undefined): boolean => {
  if (!accept || accept.trim() === "") return true;
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .every(
      (token) =>
        token === "*/*" ||
        token.startsWith("image/") ||
        token.startsWith("video/"),
    );
};

/**
 * Image-only pickers can't filter by MIME type or extension — they only
 * offer a media-category switch. Warns once per adapter instance, dev-only,
 * when `accept` requests something an image picker can't honor.
 */
const createIgnoredAcceptWarner = (adapterName: string) => {
  let warned = false;
  return (accept: string | undefined) => {
    if (warned || isImageOrVideoAccept(accept)) return;
    warned = true;
    if (isDevEnvironment()) {
      console.warn(
        `[uplofile] ${adapterName} ignores the \`accept\` prop ("${accept}") — ` +
          "image pickers only filter by media category (images/videos), not MIME type or extension.",
      );
    }
  };
};

/**
 * `@react-native-documents/picker`'s `pick()` throws on cancellation, with
 * `err.code === "OPERATION_CANCELED"`.
 */
const isReactNativeDocumentsPickerCancel = (err: unknown): boolean =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  (err as { code?: unknown }).code === "OPERATION_CANCELED";

type DocumentPickerLikeAsset = { name?: string | null; type?: string | null };

/**
 * Wraps a caller-supplied `@react-native-documents/picker` `pick()` function.
 * Verified against the package's actual installed type definitions
 * (`node_modules/@react-native-documents/picker`, v10.1.7).
 */
export function adapterReactNativeDocumentsPicker<
  TFileSource extends DocumentPickerLikeAsset = DocumentPickerLikeAsset,
>(
  pick: (options: {
    type?: string[];
    allowMultiSelection?: boolean;
  }) => Promise<TFileSource[]>,
): PickFilesFn<TFileSource> {
  return async (accept, { multiple }) => {
    try {
      const results = await pick({
        type: getNativePickerAcceptTypes(accept),
        allowMultiSelection: multiple,
      });
      return results.filter((result) =>
        acceptsFile(
          { name: result.name ?? "", type: result.type ?? "" },
          accept,
        ),
      );
    } catch (err) {
      if (isReactNativeDocumentsPickerCancel(err)) return [];
      throw err;
    }
  };
}

type ExpoDocumentPickerAsset = { name: string; mimeType?: string };
type ExpoDocumentPickerResult<TAsset> =
  | { canceled: false; assets: TAsset[] }
  | { canceled: true; assets: null };

/**
 * Wraps a caller-supplied `expo-document-picker` `getDocumentAsync()`
 * function. `expo-document-picker` resolves `{ canceled, assets: null }`
 * on cancellation rather than throwing.
 *
 * Verified against the package's published type definitions (v57.0.1) — not
 * installed in this repo, so verify against your own installed version too.
 */
export function adapterExpoDocumentPicker<
  TFileSource extends ExpoDocumentPickerAsset = ExpoDocumentPickerAsset,
>(
  getDocumentAsync: (options: {
    type?: string | string[];
    multiple?: boolean;
  }) => Promise<ExpoDocumentPickerResult<TFileSource>>,
): PickFilesFn<TFileSource> {
  return async (accept, { multiple }) => {
    const result = await getDocumentAsync({
      type: getNativePickerAcceptTypes(accept) ?? "*/*",
      multiple,
    });
    if (result.canceled) return [];
    return result.assets.filter((asset) =>
      acceptsFile({ name: asset.name, type: asset.mimeType ?? "" }, accept),
    );
  };
}

type ExpoImagePickerAsset = { uri: string };
type ExpoImagePickerResult<TAsset> =
  | { canceled: false; assets: TAsset[] }
  | { canceled: true; assets: null };

/**
 * Wraps a caller-supplied `expo-image-picker` `launchImageLibraryAsync()`
 * function. Resolves `{ canceled, assets: null }` on cancellation, like
 * `expo-document-picker`. Ignores `accept` by design — image pickers only
 * filter by media category, not MIME type or extension — and warns
 * (dev-only, once) if a non-image/video `accept` is passed.
 *
 * Verified against the package's published type definitions (v57.0.8,
 * fetched from the npm registry) — `expo-image-picker` isn't installed in
 * this repo, so cross-check against the version you actually install.
 */
export function adapterExpoImagePicker<
  TFileSource extends ExpoImagePickerAsset = ExpoImagePickerAsset,
>(
  launchImageLibraryAsync: (options: {
    mediaTypes?: ("images" | "videos")[];
    allowsMultipleSelection?: boolean;
  }) => Promise<ExpoImagePickerResult<TFileSource>>,
): PickFilesFn<TFileSource> {
  const warnIgnoredAccept = createIgnoredAcceptWarner("adapterExpoImagePicker");
  return async (accept, { multiple }) => {
    warnIgnoredAccept(accept);
    const result = await launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: multiple,
    });
    if (result.canceled) return [];
    return result.assets;
  };
}

type RNImagePickerAsset = { uri?: string };
type RNImagePickerResponse<TAsset> = {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: TAsset[];
};

/**
 * Wraps a caller-supplied `react-native-image-picker` `launchImageLibrary()`
 * function. This package resolves `{ didCancel }` on cancellation and
 * reports failures as `{ errorCode, errorMessage }` instead of throwing —
 * since `PickFilesFn` has no side channel for a non-cancel failure, a
 * returned `errorCode` is translated into a thrown `Error` here. Ignores
 * `accept` by design and warns (dev-only, once) if a non-image/video
 * `accept` is passed.
 *
 * Verified against the package's published type definitions (v8.2.1,
 * fetched from the npm registry) — `react-native-image-picker` isn't
 * installed in this repo, so cross-check against the version you actually
 * install.
 */
export function adapterReactNativeImagePicker<
  TFileSource extends RNImagePickerAsset = RNImagePickerAsset,
>(
  launchImageLibrary: (options: {
    mediaType: "mixed";
    selectionLimit?: number;
  }) => Promise<RNImagePickerResponse<TFileSource>>,
): PickFilesFn<TFileSource> {
  const warnIgnoredAccept = createIgnoredAcceptWarner(
    "adapterReactNativeImagePicker",
  );
  return async (accept, { multiple }) => {
    warnIgnoredAccept(accept);
    const response = await launchImageLibrary({
      mediaType: "mixed",
      selectionLimit: multiple ? 0 : 1,
    });
    if (response.didCancel) return [];
    if (response.errorCode) {
      throw new Error(response.errorMessage || response.errorCode);
    }
    return response.assets ?? [];
  };
}
