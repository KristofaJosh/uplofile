import type {
  BeforeUploadFn as SharedBeforeUploadFn,
  ImageUploaderContextValue as SharedImageUploaderContextValue,
  PreviewRenderProps as SharedPreviewRenderProps,
  RootProps as SharedRootProps,
  TriggerRenderProps as SharedTriggerRenderProps,
  UplofileRootRef as SharedUplofileRootRef,
  UploadFileItem as SharedUploadFileItem,
} from "../shared/types";

/**
 * Web re-exports of the shared generic types, pinned to DOM `File` as the
 * file-source default so existing web consumers keep the same inferred
 * types they had before the shared defaults became platform-neutral.
 */
export type UploadFileItem<
  TMeta = any,
  TFileSource = File,
> = SharedUploadFileItem<TMeta, TFileSource>;

export type BeforeUploadFn<
  TMeta = any,
  TFileSource = File,
> = SharedBeforeUploadFn<TMeta, TFileSource>;

export type RootProps<TMeta = any, TFileSource = File> = SharedRootProps<
  TMeta,
  TFileSource
>;

export type ImageUploaderContextValue<
  TMeta = any,
  TFileSource = File,
> = SharedImageUploaderContextValue<TMeta, TFileSource>;

export type TriggerRenderProps<
  TMeta = any,
  TFileSource = File,
> = SharedTriggerRenderProps<TMeta, TFileSource>;

export type PreviewRenderProps<
  TMeta = any,
  TFileSource = File,
> = SharedPreviewRenderProps<TMeta, TFileSource>;

export type UplofileRootRef<
  TMeta = any,
  TFileSource = File,
> = SharedUplofileRootRef<TMeta, TFileSource>;
