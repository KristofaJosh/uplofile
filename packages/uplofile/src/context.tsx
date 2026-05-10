import type { DragEvent, RefObject } from "react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ImageUploaderContextValue,
  ItemActions,
  RootProps,
  UploadFileItem,
  UplofileRootRef,
} from "./types";
import { uid, acceptsFile } from "./utils";

export const UploaderCtx = createContext<ImageUploaderContextValue | null>(
  null,
);

/**
 * Root provider component. Wraps all uploader children and manages file-upload state.
 *
 * Handles file selection, drag-and-drop, upload lifecycle (start/progress/done/error/cancel),
 * blob URL tracking, item removal (optimistic/strict), and imperative ref access.
 *
 * @template TMeta - Optional metadata type carried on each file item.
 */
export const Root = forwardRef(
  <TMeta = any,>(
    {
      multiple = true,
      initial = [],
      onChange,
      onLoadingChange,
      upload,
      removeMode = "optimistic",
      onRemove,
      accept = "image/*",
      beforeUpload,
      name = "image",
      maxCount,
      disabled,
      children,
    }: RootProps<TMeta>,
    ref: React.Ref<UplofileRootRef<TMeta>>,
  ) => {
    const [items, setItems] = useState<UploadFileItem<TMeta>[]>([]);
    const itemsRef = useRef(items);
    const [isLoading, setIsLoading] = useState(
      Array.isArray(initial) ? initial.length > 0 : !!initial,
    );
    const controllers = useRef(new Map<string, AbortController>());
    const removeControllers = useRef(new Map<string, AbortController>());
    const blobUrlsRef = useRef(new Set<string>());
    const inputRef = useRef<HTMLInputElement | null>(null);
    const hasHydratedInitialRef = useRef(false);
    const onLoadingChangeRef = useRef(onLoadingChange);

    // Keep a ref in sync with items so imperative actions (remove/retry) always
    // read the latest state, even inside stale closures like useMemo callbacks.
    useLayoutEffect(() => {
      itemsRef.current = items;
    }, [items]);

    useEffect(() => {
      onLoadingChangeRef.current = onLoadingChange;
    }, [onLoadingChange]);

    useEffect(() => {
      onLoadingChangeRef.current?.(isLoading);
    }, [isLoading]);

    const createBlobUrl = useCallback((file: File) => {
      const url = URL.createObjectURL(file);
      blobUrlsRef.current.add(url);
      return url;
    }, []);

    const revokeBlobUrl = useCallback((url: string) => {
      if (blobUrlsRef.current.delete(url)) {
        URL.revokeObjectURL(url);
      }
    }, []);

    // Hydrate initial items from the server and keep them marked as done
    useEffect(() => {
      if (hasHydratedInitialRef.current) return;

      const hydrate = async () => {
        try {
          const arr = await initial;
          if (!Array.isArray(arr) || arr.length === 0) return;

          const mapped: UploadFileItem<TMeta>[] = arr.map((it) => {
            return {
              uid: it.uid || it.id,
              id: it.id,
              name: it.name,
              url: it.url,
              status: "done",
              meta: it.meta,
            } as UploadFileItem<TMeta>;
          });

          // Append server items if user already added files while loading; avoid replacing
          setItems((prev) => {
            if (prev.length === 0) return mapped;
            const existing = new Set(prev.map((i) => i.uid));
            const toAppend = mapped.filter((m) => !existing.has(m.uid));
            if (toAppend.length === 0) return prev;
            return [...prev, ...toAppend];
          });
          hasHydratedInitialRef.current = true;
        } finally {
          setIsLoading(false);
        }
      };

      void hydrate();
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
      (next: UploadFileItem<TMeta>[] | ((prev: UploadFileItem<TMeta>[]) => UploadFileItem<TMeta>[])) => {
        setItems((prev) => {
          const nextState = typeof next === "function" ? next(prev) : next;
          if (onChange) Promise.resolve(onChange(nextState)).catch(() => {});
          return nextState;
        });
      },
      [onChange],
    );

    const startUpload = useCallback(
      async (item: UploadFileItem<TMeta>) => {
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
          const result = await upload(
            item.file,
            controller.signal,
            setProgress,
          );

          emitChange((items) =>
            items.map((it) => {
              if (it.uid !== item.uid) return it;
              if (it.previewUrl?.startsWith("blob:")) {
                revokeBlobUrl(it.previewUrl);
              }
              const serverPreview = result.previewUrl ?? result.url;
              return {
                ...it,
                status: "done",
                url: result.url,
                id: result.id ?? it.id,
                previewUrl: serverPreview,
                meta: result.meta ?? it.meta,
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
      async (files: FileList | File[] | null) => {
        if (!files) return;
        const selected = Array.isArray(files) ? files : Array.from(files);
        if (selected.length === 0) return;
        const remaining = maxCount
          ? Math.max(0, maxCount - items.filter((i) => i.status !== "canceled").length)
          : undefined;
        const toUse =
          typeof remaining === "number"
            ? selected.slice(0, remaining)
            : selected;

        let newItems: UploadFileItem<TMeta>[] = toUse.map((file) => ({
          uid: uid(),
          name: file.name,
          file,
          previewUrl: createBlobUrl(file),
          status: "idle",
          progress: 0,
        }));

        if (beforeUpload) {
          const result = await beforeUpload(newItems, {
            prevItems: items,
            remaining,
            maxCount,
            accept,
          });
          if (result === false) {
            newItems.forEach((it) => {
              if (it.previewUrl) revokeBlobUrl(it.previewUrl);
            });
            return;
          }

          if (Array.isArray(result)) {
            const resultMap = new Map(result.map((r) => [r.uid, r]));
            const processedItems: UploadFileItem<TMeta>[] = [];

            for (const item of newItems) {
              const validation = resultMap.get(item.uid);
              if (!validation) {
                if (item.previewUrl) revokeBlobUrl(item.previewUrl);
                continue;
              }

              if (validation.valid) {
                processedItems.push({
                  ...item,
                  meta: validation.meta !== undefined ? validation.meta : item.meta,
                  id: validation.id !== undefined ? validation.id : item.id,
                });
              } else if (validation.reason) {
                processedItems.push({
                  ...item,
                  status: "error",
                  error: validation.reason,
                  meta: validation.meta !== undefined ? validation.meta : item.meta,
                  id: validation.id !== undefined ? validation.id : item.id,
                });
              } else {
                if (item.previewUrl) revokeBlobUrl(item.previewUrl);
              }
            }
            newItems = processedItems;
          }
        }

        if (newItems.length === 0) return;

        emitChange((prev) => [...prev, ...newItems]);
        newItems.forEach((it) => {
          if (it.status === "idle") {
            startUpload(it);
          }
        });
      },
      [beforeUpload, createBlobUrl, emitChange, items, maxCount, revokeBlobUrl, startUpload],
    );

    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        void selectFiles(e.target.files);
        e.currentTarget.value = "";
      },
      [selectFiles],
    );

    const onDrop = useCallback(
      (e: DragEvent) => {
        e.preventDefault();
        if (disabled) return;
        const dtFiles = e.dataTransfer?.files;
        if (!dtFiles || dtFiles.length === 0) return;
        const accepted = Array.from(dtFiles).filter((f) =>
          acceptsFile(f, accept),
        );
        if (accepted.length === 0) return;
        void selectFiles(accepted);
      },
      [disabled, selectFiles, accept],
    );

    const onDragOver = useCallback((e: DragEvent) => e.preventDefault(), []);

    const actions: ItemActions = useMemo(
      () => ({
        cancel: (uidStr: string) => {
          const ctrl = controllers.current.get(uidStr);
          ctrl?.abort();
        },
        remove: async (uidStr: string) => {
          const item = itemsRef.current.find((i) => i.uid === uidStr);
          if (!item) return;

          controllers.current.get(uidStr)?.abort();

          const revokePreview = () => {
            if (item.previewUrl?.startsWith("blob:")) {
              revokeBlobUrl(item.previewUrl);
            }
          };

          if (!onRemove || item.status !== "done") {
            revokePreview();
            emitChange((list) => list.filter((i) => i.uid !== uidStr));
            return;
          }

          const ctrl = new AbortController();
          removeControllers.current.set(uidStr, ctrl);

          if (removeMode === "optimistic") {
            const removed = itemsRef.current.find((i) => i.uid === uidStr);
            emitChange((list) => list.filter((i) => i.uid !== uidStr));
            try {
              await onRemove(item, ctrl.signal);
              revokePreview();
            } catch {
              emitChange((list) => {
                if (list.some((i) => i.uid === uidStr)) return list;
                const restored = removed
                  ? { ...removed, status: "done" as const }
                  : { ...item, status: "done" as const };
                return [...list, restored];
              });
            } finally {
              removeControllers.current.delete(uidStr);
            }
          } else {
            emitChange((list) =>
              list.map((it) =>
                it.uid === uidStr ? { ...it, status: "removing" as const } : it,
              ),
            );
            try {
              await onRemove(item, ctrl.signal);
              revokePreview();
              emitChange((list) => list.filter((i) => i.uid !== uidStr));
            } catch {
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
          const item = itemsRef.current.find((i) => i.uid === uidStr);
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
      [emitChange, onRemove, removeMode, revokeBlobUrl, startUpload],
    );

    useEffect(
      () => () => {
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();
        controllers.current.forEach((c) => c.abort());
      },
      [],
    );

    const openFileDialog = useCallback(() => inputRef.current?.click(), []);

    const getDropzoneProps = useCallback(() => ({
      role: "button",
      tabIndex: 0,
      onDrop,
      onDragOver,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      },
      "data-disabled": disabled ? "" : undefined,
      "data-multiple": multiple ? "" : undefined,
    }), [disabled, multiple, onDrop, onDragOver]);

    const fileInputProps = useMemo(() => ({
      ref: inputRef as RefObject<HTMLInputElement>,
      onChange: onInputChange,
      accept,
      multiple,
      disabled,
    }), [onInputChange, accept, multiple, disabled]);

    const ctx: ImageUploaderContextValue<TMeta> = useMemo(() => ({
      items,
      isLoading,
      disabled,
      multiple,
      accept,
      actions,
      openFileDialog,
      fileInputProps,
      getDropzoneProps,
      setItems,
      hiddenInputValue,
      name,
    }), [
      items, isLoading, disabled, multiple, accept, actions,
      openFileDialog, fileInputProps, getDropzoneProps, setItems,
      hiddenInputValue, name,
    ]);

    // Expose imperative methods via ref
    useImperativeHandle(
      ref,
      () => ({
        setItems: emitChange,
        getItems: () => items,
        isLoading,
        onDrop,
        onDragOver,
        openFileDialog: () => inputRef.current?.click(),
        actions,
        get onLoadingChange() {
          return onLoadingChangeRef.current;
        },
        set onLoadingChange(callback) {
          onLoadingChangeRef.current = callback;
        },
      }),
      [emitChange, items, isLoading, onDrop, onDragOver, actions],
    );

    return (
      <UploaderCtx.Provider value={ctx}>
        <div data-part="root">
          <input type="file" hidden {...ctx.fileInputProps} />
          {children}
        </div>
      </UploaderCtx.Provider>
    );
  },
);
