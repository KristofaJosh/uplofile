import type {
  ChangeEvent,
  DragEvent,
  PropsWithChildren,
  RefObject,
} from "react";

export type MaybePromise<T> = T | Promise<T>;

export type UploadStatus =
  | "idle"
  | "uploading"
  | "done"
  | "error"
  | "canceled"
  | "removing";

export type UploadFileItem<TMeta = any> = {
  uid: string;
  id?: string;
  name: string;
  url?: string;
  previewUrl?: string;
  file?: File;
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

export type UplofileRootRef<TMeta = any> = {
  setItems: (
    items:
      | UploadFileItem<TMeta>[]
      | ((prev: UploadFileItem<TMeta>[]) => UploadFileItem<TMeta>[]),
  ) => void;
  getItems: () => UploadFileItem<TMeta>[];
  isLoading: boolean;
  onDrop: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  openFileDialog: () => void;
  actions: ItemActions;
  onLoadingChange?: (isLoading: boolean) => void;
};

export type BeforeUploadFn<TMeta = any> = (
  items: UploadFileItem<TMeta>[],
  state: {
    /**
     * The items that are currently in the state before adding the new items.
     * This can be useful for validating new items against existing items (e.g. checking for duplicates).
     */
    prevItems: UploadFileItem<TMeta>[];
    /**
     * Counts all items in the state excluding canceled items.
     * This is useful for validating maxCount in the case where some items are canceled but not yet removed from the state.
     */
    remaining?: number;
    /**
     * The maxCount prop passed to the Root component.
     * This is useful for validating the total number of items after adding the new items.
     */
    maxCount?: number;
    /**
     * The "accept" prop passed to the Root component, which can be used for validating file types before upload.
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

export type RootProps<TMeta = any> = PropsWithChildren<{
  multiple?: boolean;
  initial?: MaybePromise<
    Array<Pick<UploadFileItem<TMeta>, "uid" | "id" | "name" | "url" | "meta">>
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
  beforeUpload?: BeforeUploadFn;
  onChange?: (items: UploadFileItem<TMeta>[]) => Promise<void> | void;
  onLoadingChange?: (isLoading: boolean) => void;
  upload: (
    file: File,
    signal: AbortSignal,
    setProgress?: (pct: number) => void,
  ) => Promise<UploadResult<TMeta>>;
  onRemove?: (
    item: UploadFileItem<TMeta>,
    signal: AbortSignal,
  ) => Promise<void | any>;
}>;

export type ItemActions = {
  cancel: (uid: string) => void;
  remove: (uid: string) => void;
  retry: (uid: string) => void;
};

export type ImageUploaderContextValue<TMeta = any> = {
  items: UploadFileItem<TMeta>[];
  setItems: (items: UploadFileItem<TMeta>[]) => void;
  isLoading: boolean;
  isDragging: boolean;
  disabled?: boolean;
  multiple: boolean;
  accept: string;
  actions: ItemActions;
  openFileDialog: () => void;
  fileInputProps: {
    ref: RefObject<HTMLInputElement>;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    accept: string;
    multiple: boolean;
    disabled?: boolean;
  };
  getDropzoneProps: () => {
    role: string;
    tabIndex: number;
    onDrop: (e: DragEvent) => void;
    onDragOver: (e: DragEvent) => void;
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    "data-dragging"?: "true";
    "data-disabled"?: string;
    "data-multiple"?: string;
  };
  hiddenInputValue: string;
  name: string;
};

export type TriggerRenderProps<TMeta = any> = {
  items: UploadFileItem<TMeta>[];
  isLoading: boolean;
  isUploading: boolean;
  uploadingCount: number;
  doneCount: number;
  errorCount: number;
  totalProgress?: number;
  open: () => void;
};

export type PreviewRenderProps<TMeta = any> = {
  items: UploadFileItem<TMeta>[];
  isLoading: boolean;
  setItems: (items: UploadFileItem<TMeta>[]) => void;
  actions: ItemActions;
};
