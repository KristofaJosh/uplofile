import type { DocumentPickerResponse } from "@react-native-documents/picker";

import type {
  BeforeUploadFn as SharedBeforeUploadFn,
  ImageUploaderContextValue as SharedImageUploaderContextValue,
  PickFilesFn as SharedPickFilesFn,
  PreviewRenderProps as SharedPreviewRenderProps,
  RootProps as SharedRootProps,
  TriggerRenderProps as SharedTriggerRenderProps,
  UplofileRootRef as SharedUplofileRootRef,
  UploadFileItem as SharedUploadFileItem,
} from "../shared/types";

/**
 * Native re-exports of the shared generic types, pinned to the document
 * picker's response shape as the file-source default instead of the DOM
 * `File` type that isn't available in a React Native environment.
 */
export type UploadFileItem<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedUploadFileItem<TMeta, TFileSource>;

export type BeforeUploadFn<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedBeforeUploadFn<TMeta, TFileSource>;

export type PickFilesFn<TFileSource = DocumentPickerResponse> =
  SharedPickFilesFn<TFileSource>;

export type RootProps<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedRootProps<TMeta, TFileSource> & {
  /**
   * Consumer-supplied replacement for the built-in
   * `@react-native-documents/picker` call. When provided, `Root` invokes
   * this instead of `pick()` — see `adapterReactNativeDocumentsPicker`,
   * `adapterExpoDocumentPicker`, `adapterExpoImagePicker`, and
   * `adapterReactNativeImagePicker`.
   */
  pickFiles?: PickFilesFn<TFileSource>;
  /**
   * Silences the one-time deprecation warning logged when `pickFiles`
   * is omitted and `Root` falls back to `@react-native-documents/picker`.
   */
  suppressDeprecationWarnings?: boolean;
};

export type ImageUploaderContextValue<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedImageUploaderContextValue<TMeta, TFileSource>;

export type TriggerRenderProps<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedTriggerRenderProps<TMeta, TFileSource>;

export type PreviewRenderProps<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedPreviewRenderProps<TMeta, TFileSource>;

/**
 * Native's imperative ref never sets `onDrop`/`onDragOver` — those exist
 * only on the web Root — so they're omitted here rather than exposing the
 * DOM-only `DragEvent` type on a platform that doesn't have one.
 */
export type UplofileRootRef<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = Omit<SharedUplofileRootRef<TMeta, TFileSource>, "onDrop" | "onDragOver">;
