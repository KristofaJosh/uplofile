import type {
  ChangeEvent,
  DragEvent,
  PropsWithChildren,
  RefObject,
} from "react";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "done"
  | "error"
  | "canceled"
  | "removing";

export type UploadFileItem = {
  uid: string;
  id?: string;
  name: string;
  url?: string;
  previewUrl?: string;
  file?: File;
  status: UploadStatus;
  progress?: number;
  error?: string;
  data?: any;
};

export type UploadResult = { url: string; id?: string };

export type RootProps = PropsWithChildren<{
  multiple?: boolean;
  initial?: Array<Pick<UploadFileItem, "uid" | "id" | "name" | "url">>;
  /**
   * optimistic (default): remove from UI immediately, call onRemove in the background; if it fails, restore the item and show error.
   * strict: call onRemove first; only remove from UI if it succeeds.
   */
  removeMode?: "optimistic" | "strict";
  name?: string;
  maxCount?: number;
  disabled?: boolean;
  accept?: string;
  onChange?: (items: UploadFileItem[]) => Promise<void> | void;
  upload: (
    file: File,
    signal: AbortSignal,
    setProgress?: (pct: number) => void,
  ) => Promise<UploadResult>;
  onRemove?: (item: UploadFileItem, signal: AbortSignal) => Promise<void | any>;
}>;

export type ItemActions = {
  cancel: (uid: string) => void;
  remove: (uid: string) => void;
  retry: (uid: string) => void;
};

export type ImageUploaderContextValue = {
  items: UploadFileItem[];
  setItems: (items: UploadFileItem[]) => void;
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
    onKeyDown: (e: KeyboardEvent) => void;
    "data-disabled"?: string;
    "data-multiple"?: string;
  };
  hiddenInputValue: string;
  name: string;
};

export type TriggerRenderProps = {
  items: UploadFileItem[];
  isUploading: boolean;
  uploadingCount: number;
  doneCount: number;
  errorCount: number;
  totalProgress?: number;
  open: () => void;
};

export type PreviewRenderProps = {
  items: UploadFileItem[];
  setItems: (items: UploadFileItem[]) => void;
  actions: ItemActions;
};
