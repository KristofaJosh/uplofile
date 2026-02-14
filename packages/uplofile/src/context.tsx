import type { DragEvent, RefObject } from "react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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
    const [isLoading, setIsLoading] = useState(
      Array.isArray(initial) ? initial.length > 0 : !!initial,
    );
    const controllers = useRef(new Map<string, AbortController>());
    const removeControllers = useRef(new Map<string, AbortController>());
    const inputRef = useRef<HTMLInputElement | null>(null);
    const hasHydratedInitialRef = useRef(false);
    const onLoadingChangeRef = useRef(onLoadingChange);

    useEffect(() => {
      onLoadingChangeRef.current = onLoadingChange;
    }, [onLoadingChange]);

    useEffect(() => {
      onLoadingChangeRef.current?.(isLoading);
    }, [isLoading]);

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
      (
        next:
          | UploadFileItem<TMeta>[]
          | ((prev: UploadFileItem<TMeta>[]) => UploadFileItem<TMeta>[]),
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
              // Revoke the local objectURL preview to avoid memory leaks
              if (it.previewUrl && it.previewUrl.startsWith("blob:")) {
                try {
                  URL.revokeObjectURL(it.previewUrl);
                } catch {
                  /*fail silently*/
                }
              }
              const serverPreview =
                result.previewUrl ?? (result as any).preview ?? result.url;
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
          ? Math.max(
              0,
              maxCount - items.filter((i) => i.status !== "canceled").length,
            )
          : undefined;
        const toUse =
          typeof remaining === "number"
            ? selected.slice(0, remaining)
            : selected;

        let newItems: UploadFileItem<TMeta>[] = toUse.map((file) => ({
          uid: uid(),
          name: file.name,
          file,
          previewUrl: URL.createObjectURL(file),
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
              if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
            });
            return;
          }

          if (Array.isArray(result)) {
            const resultMap = new Map(result.map((r) => [r.uid, r]));
            const processedItems: UploadFileItem<TMeta>[] = [];

            for (const item of newItems) {
              const validation = resultMap.get(item.uid);
              if (!validation) {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                continue;
              }

              if (validation.valid) {
                processedItems.push({
                  ...item,
                  meta:
                    validation.meta !== undefined ? validation.meta : item.meta,
                  id: validation.id !== undefined ? validation.id : item.id,
                });
              } else if (validation.reason) {
                processedItems.push({
                  ...item,
                  status: "error",
                  error: validation.reason,
                  meta:
                    validation.meta !== undefined ? validation.meta : item.meta,
                  id: validation.id !== undefined ? validation.id : item.id,
                });
              } else {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
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
      [beforeUpload, emitChange, items, maxCount, startUpload],
    );

    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        void selectFiles(e.target.files);
        e.currentTarget.value = "";
      },
      [selectFiles],
    );

    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const resetDragState = useCallback(() => {
      dragCounter.current = 0;
      setIsDragging(false);
    }, []);

    const onDrop = useCallback(
      (e: DragEvent) => {
        e.preventDefault();
        resetDragState();
        if (disabled) return;
        const dtFiles = e.dataTransfer?.files;
        if (!dtFiles || dtFiles.length === 0) return;
        const accepted = Array.from(dtFiles).filter((f) =>
          acceptsFile(f, accept),
        );
        if (accepted.length === 0) return;
        void selectFiles(accepted);
      },
      [disabled, selectFiles, accept, resetDragState],
    );

    const onDragOver = useCallback((e: DragEvent) => e.preventDefault(), []);

    const onDragEnter = useCallback(
      (e: DragEvent) => {
        e.preventDefault();
        if (disabled) return;
        dragCounter.current += 1;
        setIsDragging(true);
      },
      [disabled],
    );

    const onDragLeave = useCallback(
      (e: DragEvent) => {
        e.preventDefault();
        if (disabled) return;
        dragCounter.current = Math.max(0, dragCounter.current - 1);
        if (dragCounter.current === 0) setIsDragging(false);
      },
      [disabled],
    );

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

    const ctx: ImageUploaderContextValue<TMeta> = {
      items,
      isLoading,
      isDragging,
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
        onDragEnter,
        onDragLeave,
        onKeyDown: (e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        },
        "data-dragging": isDragging ? "true" : undefined,
        "data-disabled": disabled ? "" : undefined,
        "data-multiple": multiple ? "" : undefined,
      }),
      setItems,
      hiddenInputValue,
      name,
    };

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
