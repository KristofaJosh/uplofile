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
 * Default file-source shape for `uplofile/native`: the fields uplofile reads
 * from whatever `pickFiles` returns. Document-picker results match it; see
 * the React Native docs for image-picker caveats.
 */
export type NativeFile = {
  uri: string;
  name?: string | null;
  type?: string | null;
  size?: number | null;
};

/**
 * Native re-exports of the shared generic types, defaulting the file source
 * to `NativeFile` instead of the DOM `File` type, which React Native lacks.
 */
export type UploadFileItem<
  TMeta = any,
  TFileSource = NativeFile,
> = SharedUploadFileItem<TMeta, TFileSource>;

export type BeforeUploadFn<
  TMeta = any,
  TFileSource = NativeFile,
> = SharedBeforeUploadFn<TMeta, TFileSource>;

export type PickFilesFn<TFileSource = NativeFile> =
  SharedPickFilesFn<TFileSource>;

export type RootProps<
  TMeta = any,
  TFileSource = NativeFile,
> = SharedRootProps<TMeta, TFileSource> & {
  /**
   * Opens your picker and resolves to the chosen files (an empty array on
   * cancel). Use `adapterReactNativeDocumentsPicker`,
   * `adapterExpoDocumentPicker`, `adapterExpoImagePicker` or
   * `adapterReactNativeImagePicker`, or write your own.
   */
  pickFiles: PickFilesFn<TFileSource>;
  /**
   * Called when `pickFiles` rejects (for example, a denied permission).
   * Cancelling is not an error: adapters resolve to `[]` instead. Without
   * this prop, the error is logged with `console.warn`.
   */
  onPickError?: (error: unknown) => void;
};

export type ImageUploaderContextValue<
  TMeta = any,
  TFileSource = NativeFile,
> = SharedImageUploaderContextValue<TMeta, TFileSource>;

export type TriggerRenderProps<
  TMeta = any,
  TFileSource = NativeFile,
> = SharedTriggerRenderProps<TMeta, TFileSource>;

export type PreviewRenderProps<
  TMeta = any,
  TFileSource = NativeFile,
> = SharedPreviewRenderProps<TMeta, TFileSource>;

/**
 * Native's imperative ref never sets `onDrop`/`onDragOver` — those exist
 * only on the web Root — so they're omitted here rather than exposing the
 * DOM-only `DragEvent` type on a platform that doesn't have one.
 */
export type UplofileRootRef<
  TMeta = any,
  TFileSource = NativeFile,
> = Omit<SharedUplofileRootRef<TMeta, TFileSource>, "onDrop" | "onDragOver">;
