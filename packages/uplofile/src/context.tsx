import type { DragEvent, RefObject } from "react";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ImageUploaderContextValue,
  ItemActions,
  RootProps,
  UploadFileItem,
} from "./types";
import { uid } from "./utils";

export const UploaderCtx = createContext<ImageUploaderContextValue | null>(
  null,
);

export const Root = ({
  multiple = true,
  initial = [],
  onChange,
  upload,
  removeMode = "optimistic",
  onRemove,
  accept = "image/*",
  name = "images",
  maxCount,
  disabled,
  children,
}: RootProps) => {
  const [items, setItems] = useState<UploadFileItem[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const removeControllers = useRef(new Map<string, AbortController>());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hasHydratedInitialRef = useRef(false);

  // Hydrate initial items from the server and keep them marked as done
  useEffect(() => {
    if (hasHydratedInitialRef.current) return;
    const arr = initial ?? [];
    if (!Array.isArray(arr) || arr.length === 0) return;

    const mapped: UploadFileItem[] = arr.map((it) => {
      return {
        uid: it.uid || it.id,
        id: it.id,
        name: it.name,
        url: it.url,
        status: "done",
      } as UploadFileItem;
    });

    // Only hydrate if the user hasn't already added/modified items locally
    setItems((prev) => (prev.length === 0 ? mapped : prev));
    hasHydratedInitialRef.current = true;
  }, [initial]);

  const hiddenInputValue = useMemo(() => {
    const done = items.filter((i) => i.status === "done" && i.url);
    return JSON.stringify(
      done.map(
        ({
          uid: _u,
          previewUrl: _p,
          file: _f,
          status: _s,
          progress: _pr,
          error: _e,
          ...rest
        }) => rest,
      ),
    );
  }, [items]);

  const emitChange = useCallback(
    (
      next: UploadFileItem[] | ((prev: UploadFileItem[]) => UploadFileItem[]),
    ) => {
      setItems((prev) => {
        const nextState =
          typeof next === "function" ? (next as any)(prev) : next;
        if (onChange) Promise.resolve(onChange(nextState)).catch(() => {});
        return nextState;
      });
    },
    [onChange],
  );

  const startUpload = useCallback(
    async (item: UploadFileItem) => {
      if (!item.file) return;
      const controller = new AbortController();
      controllers.current.set(item.uid, controller);

      const setProgress = (pct: number) => {
        emitChange((items) =>
          items.map((it) =>
            it.uid === item.uid
              ? { ...it, progress: Math.max(0, Math.min(100, pct)) }
              : it,
          ),
        );
      };

      emitChange((items) =>
        items.map((it) =>
          it.uid === item.uid
            ? { ...it, status: "uploading", error: undefined }
            : it,
        ),
      );

      try {
        const result = await upload(item.file, controller.signal, setProgress);

        emitChange((items) =>
          items.map((it) => {
            if (it.uid !== item.uid) return it;
            // Revoke the local objectURL preview to avoid memory leaks
            if (it.previewUrl && it.previewUrl.startsWith("blob:")) {
              try {
                URL.revokeObjectURL(it.previewUrl);
              } catch {
                /*fail silently*/
              }
            }
            const serverPreview = (result as any)?.preview || result.url;
            return {
              ...it,
              status: "done",
              url: result.url,
              id: result.id,
              previewUrl: serverPreview,
              progress: 100,
            };
          }),
        );
      } catch (err: any) {
        const wasAborted = controller.signal.aborted;
        emitChange((items) =>
          items.map((it) =>
            it.uid === item.uid
              ? {
                  ...it,
                  status: wasAborted ? "canceled" : "error",
                  error: wasAborted
                    ? undefined
                    : err?.message || "Upload failed",
                }
              : it,
          ),
        );
      } finally {
        controllers.current.delete(item.uid);
      }
    },
    [emitChange, upload],
  );

  const selectFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const selected = Array.from(files);
      const remaining = maxCount
        ? Math.max(
            0,
            maxCount - items.filter((i) => i.status !== "canceled").length,
          )
        : undefined;
      const toUse =
        typeof remaining === "number" ? selected.slice(0, remaining) : selected;

      const newItems: UploadFileItem[] = toUse.map((file) => ({
        uid: uid(),
        name: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "idle",
        progress: 0,
      }));

      emitChange([...items, ...newItems]);
      newItems.forEach((it) => startUpload(it));
    },
    [emitChange, items, maxCount, startUpload],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      selectFiles(e.target.files);
      e.currentTarget.value = "";
    },
    [selectFiles],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      selectFiles(e.dataTransfer.files);
    },
    [disabled, selectFiles],
  );

  const onDragOver = useCallback((e: DragEvent) => e.preventDefault(), []);

  const actions: ItemActions = useMemo(
    () => ({
      cancel: (uidStr: string) => {
        const ctrl = controllers.current.get(uidStr);
        ctrl?.abort();
      },
      remove: async (uidStr: string) => {
        const item = items.find((i) => i.uid === uidStr);
        if (!item) return;

        // abort any in-flight upload first
        controllers.current.get(uidStr)?.abort();

        // If no server-side removal needed or not uploaded yet, just remove
        if (!onRemove || item.status !== "done") {
          emitChange((list) => list.filter((i) => i.uid !== uidStr));
          return;
        }

        const ctrl = new AbortController();
        removeControllers.current.set(uidStr, ctrl);

        if (removeMode === "optimistic") {
          const prev = items;
          // remove from UI immediately
          emitChange((list) => list.filter((i) => i.uid !== uidStr));
          try {
            await onRemove(item, ctrl.signal);
          } catch {
            // rollback UI if server delete fails
            emitChange(prev);
          } finally {
            removeControllers.current.delete(uidStr);
          }
        } else {
          // strict: mark as removing, wait for API, then remove
          emitChange((list) =>
            list.map((it) =>
              it.uid === uidStr ? { ...it, status: "removing" as const } : it,
            ),
          );
          try {
            await onRemove(item, ctrl.signal);
            emitChange((list) => list.filter((i) => i.uid !== uidStr));
          } catch {
            // revert to done if delete fails
            emitChange((list) =>
              list.map((it) =>
                it.uid === uidStr ? { ...it, status: "done" as const } : it,
              ),
            );
          } finally {
            removeControllers.current.delete(uidStr);
          }
        }
      },
      retry: (uidStr: string) => {
        const item = items.find((i) => i.uid === uidStr);
        if (!item) return;
        if (item.file) {
          void startUpload({
            ...item,
            status: "idle",
            error: undefined,
            progress: 0,
          });
        }
      },
    }),
    [emitChange, items, onRemove, removeMode, startUpload],
  );

  useEffect(
    () => () => {
      items.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
      controllers.current.forEach((c) => c.abort());
    },
    [],
  );

  const ctx: ImageUploaderContextValue = {
    items,
    disabled,
    multiple,
    accept,
    actions,
    openFileDialog: () => inputRef.current?.click(),
    fileInputProps: {
      ref: inputRef as RefObject<HTMLInputElement>,
      onChange: onInputChange,
      accept,
      multiple,
      disabled,
    },
    getDropzoneProps: () => ({
      role: "button",
      tabIndex: 0,
      onDrop,
      onDragOver,
      onKeyDown: (e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      },
      "data-disabled": disabled ? "" : undefined,
      "data-multiple": multiple ? "" : undefined,
    }),
    setItems,
    hiddenInputValue,
    name,
  };

  return (
    <UploaderCtx.Provider value={ctx}>
      <div data-part="root">
        <input type="file" hidden {...ctx.fileInputProps} />
        {children}
      </div>
    </UploaderCtx.Provider>
  );
};
