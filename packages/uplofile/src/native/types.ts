import type { DocumentPickerResponse } from "@react-native-documents/picker";

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

export type RootProps<TMeta = any, TFileSource = DocumentPickerResponse> =
  SharedRootProps<TMeta, TFileSource>;

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

export type UplofileRootRef<
  TMeta = any,
  TFileSource = DocumentPickerResponse,
> = SharedUplofileRootRef<TMeta, TFileSource>;
