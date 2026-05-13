import type { DragEvent, PropsWithChildren } from "react";

export type MaybePromise<T> = T | Promise<T>;

export type UploadStatus =
  | "idle"
  | "uploading"
  | "done"
  | "error"
  | "canceled"
  | "removing";

export type UploadFileItem<TMeta = any, TFileSource = File> = {
  uid: string;
  id?: string;
  name: string;
  url?: string;
  previewUrl?: string;
  file?: TFileSource;
  status: UploadStatus;
  progress?: number;
  error?: string;
  meta?: TMeta;
};

export type UploadResult<TMeta = any> = {
  url: string;
  id?: string;
  meta?: TMeta;
  previewUrl?: string;
};

export type BeforeUploadFn<TMeta = any, TFileSource = File> = (
  items: UploadFileItem<TMeta, TFileSource>[],
  state: {
    /**
     * The items that are currently in the state before adding the new items.
     */
    prevItems: UploadFileItem<TMeta, TFileSource>[];
    /**
     * Counts all items in the state excluding canceled items.
     */
    remaining?: number;
    /**
     * The maxCount prop passed to the Root component.
     */
    maxCount?: number;
    /**
     * The "accept" prop passed to the Root component.
     */
    accept?: string;
  },
) => MaybePromise<BeforeUploadResult<TMeta>>;

export type BeforeUploadResult<TMeta = any> =
  | boolean
  | Array<{
      valid: boolean;
      meta?: TMeta;
      id?: string;
      uid: string;
      reason?: string;
    }>;

export type RootProps<TMeta = any, TFileSource = File> = PropsWithChildren<{
  multiple?: boolean;
  initial?: MaybePromise<
    Array<
      Pick<
        UploadFileItem<TMeta, TFileSource>,
        "uid" | "id" | "name" | "url" | "meta"
      >
    >
  >;
  /**
   * optimistic (default): remove from UI immediately, call onRemove in the background; if it fails, restore the item and show error.
   * strict: call onRemove first; only remove from UI if it succeeds.
   */
  removeMode?: "optimistic" | "strict";
  name?: string;
  maxCount?: number;
  disabled?: boolean;
  accept?: string;
  beforeUpload?: BeforeUploadFn<TMeta, TFileSource>;
  onChange?: (
    items: UploadFileItem<TMeta, TFileSource>[],
  ) => Promise<void> | void;
  onLoadingChange?: (isLoading: boolean) => void;
  upload: (
    file: TFileSource,
    signal: AbortSignal,
    setProgress?: (pct: number) => void,
  ) => Promise<UploadResult<TMeta>>;
  onRemove?: (
    item: UploadFileItem<TMeta, TFileSource>,
    signal: AbortSignal,
  ) => Promise<void | any>;
}>;

export type ItemActions = {
  cancel: (uid: string) => void;
  remove: (uid: string) => void;
  retry: (uid: string) => void;
};

export type ImageUploaderContextValue<TMeta = any, TFileSource = File> = {
  items: UploadFileItem<TMeta, TFileSource>[];
  setItems: (
    items:
      | UploadFileItem<TMeta, TFileSource>[]
      | ((
          prev: UploadFileItem<TMeta, TFileSource>[],
        ) => UploadFileItem<TMeta, TFileSource>[]),
  ) => void;
  isLoading: boolean;
  disabled?: boolean;
  multiple: boolean;
  accept: string;
  actions: ItemActions;
  openFileDialog: () => void;
  fileInputProps: Record<string, any>;
  getDropzoneProps: () => Record<string, any>;
  hiddenInputValue: string;
  name: string;
};

export type TriggerRenderProps<TMeta = any, TFileSource = File> = {
  items: UploadFileItem<TMeta, TFileSource>[];
  isLoading: boolean;
  isUploading: boolean;
  uploadingCount: number;
  doneCount: number;
  errorCount: number;
  totalProgress?: number;
  open: () => void;
};

export type UplofileRootRef<TMeta = any, TFileSource = File> = {
  setItems: (
    items:
      | UploadFileItem<TMeta, TFileSource>[]
      | ((
          prev: UploadFileItem<TMeta, TFileSource>[],
        ) => UploadFileItem<TMeta, TFileSource>[]),
  ) => void;
  getItems: () => UploadFileItem<TMeta, TFileSource>[];
  isLoading: boolean;
  onDrop?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  openFileDialog: () => void;
  actions: ItemActions;
  onLoadingChange?: (isLoading: boolean) => void;
};

export type PreviewRenderProps<TMeta = any, TFileSource = File> = {
  items: UploadFileItem<TMeta, TFileSource>[];
  isLoading: boolean;
  setItems: (
    items:
      | UploadFileItem<TMeta, TFileSource>[]
      | ((
          prev: UploadFileItem<TMeta, TFileSource>[],
        ) => UploadFileItem<TMeta, TFileSource>[]),
  ) => void;
  actions: ItemActions;
};
