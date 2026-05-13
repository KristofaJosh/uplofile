import {
  createContext,
  useCallback,
  useEffect,
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
  UploaderItemsContextValue,
  UploaderStableContextValue,
} from "./types";
import { uid } from "./utils";

export const UploaderCtx = createContext<ImageUploaderContextValue | null>(
  null,
);

/**
 * Holds infrequently-changing values (actions, callbacks, props).
 * Consumers subscribed to this context skip re-renders on progress ticks.
 */
export const StableCtx = createContext<UploaderStableContextValue | null>(null);

/**
 * Holds frequently-changing values (items, isLoading).
 * Separated from StableCtx so progress-driven re-renders are isolated.
 */
export const ItemsCtx = createContext<UploaderItemsContextValue | null>(null);

export function useUplofileState<TMeta = any, TFileSource = File>({
  upload,
  onRemove,
  removeMode = "optimistic",
  beforeUpload,
  maxCount,
  accept = "image/*",
  initial = [],
  onChange,
  onLoadingChange,
  name = "image",
  createPreviewUrl,
  revokePreviewUrl,
  getFileName,
}: RootProps<TMeta, TFileSource> & {
  // Why adapter functions: these make the state machine platform-agnostic —
  // web uses URL.createObjectURL, RN uses the picker URI directly,
  // no DOM dependency leaks into shared code
  createPreviewUrl: (source: TFileSource) => string | undefined;
  revokePreviewUrl: (url: string) => void;
  getFileName: (source: TFileSource) => string;
}) {
  const [items, setItems] = useState<UploadFileItem<TMeta, TFileSource>[]>([]);
  const itemsRef = useRef(items);
  const [isLoading, setIsLoading] = useState(
    Array.isArray(initial) ? initial.length > 0 : !!initial,
  );
  const controllers = useRef(new Map<string, AbortController>());
  const removeControllers = useRef(new Map<string, AbortController>());
  // Why blobUrlsRef: tracks created preview URLs so they can be revoked on cleanup
  // (e.g. URL.revokeObjectURL for web blob: URLs). RN adapter is a no-op.
  const blobUrlsRef = useRef(new Set<string>());
  const hasHydratedInitialRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const getFileNameRef = useRef(getFileName);
  const createPreviewUrlRef = useRef(createPreviewUrl);
  const revokePreviewUrlRef = useRef(revokePreviewUrl);
  const prevItemsForOnChangeRef = useRef(items);

  useLayoutEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  // Why refs for adapter functions: adapters are passed as props from platform Roots
  // and may be inline functions. Using refs prevents recreating all internal callbacks
  // when adapters change reference (which is never — they're stable per platform).
  useEffect(() => {
    getFileNameRef.current = getFileName;
  }, [getFileName]);
  useEffect(() => {
    createPreviewUrlRef.current = createPreviewUrl;
  }, [createPreviewUrl]);
  useEffect(() => {
    revokePreviewUrlRef.current = revokePreviewUrl;
  }, [revokePreviewUrl]);

  useEffect(() => {
    onLoadingChangeRef.current?.(isLoading);
  }, [isLoading]);

  // Call onChange when items change (skip initial mount where reference matches)
  useEffect(() => {
    if (prevItemsForOnChangeRef.current === items) return;
    prevItemsForOnChangeRef.current = items;
    onChangeRef.current?.(items);
  }, [items]);

  // Hydrate initial items from the server and keep them marked as done
  useEffect(() => {
    if (hasHydratedInitialRef.current) return;

    const hydrate = async () => {
      try {
        const arr = await initial;
        if (!Array.isArray(arr) || arr.length === 0) return;

        const mapped: UploadFileItem<TMeta, TFileSource>[] = arr.map((it) => {
          return {
            uid: it.uid || it.id,
            id: it.id,
            name: it.name,
            url: it.url,
            status: "done",
            meta: it.meta,
          } as UploadFileItem<TMeta, TFileSource>;
        });

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

  // Internal wrappers that track preview URLs in blobUrlsRef for cleanup on unmount.
  // Why: the original createBlobUrl/revokeBlobUrl managed this set internally.
  // Now that adapters are external, we wrap them to preserve the lifecycle tracking.
  const trackPreviewUrl = useCallback((source: TFileSource) => {
    const url = createPreviewUrlRef.current(source);
    if (url) blobUrlsRef.current.add(url);
    return url;
  }, []);

  const untrackPreviewUrl = useCallback((url: string) => {
    if (blobUrlsRef.current.delete(url)) {
      revokePreviewUrlRef.current(url);
    }
  }, []);

  const emitChange = useCallback(
    (
      next:
        | UploadFileItem<TMeta, TFileSource>[]
        | ((
            prev: UploadFileItem<TMeta, TFileSource>[],
          ) => UploadFileItem<TMeta, TFileSource>[]),
    ) => {
      setItems(next as any);
    },
    [],
  );

  const startUpload = useCallback(
    async (item: UploadFileItem<TMeta, TFileSource>) => {
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
            // revoke the local preview URL on completion — adapter decides what "revoke" means
            if (it.previewUrl) {
              untrackPreviewUrl(it.previewUrl);
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
    [emitChange, untrackPreviewUrl, upload],
  );

  const selectFiles = useCallback(
    async (sources: TFileSource[]) => {
      if (sources.length === 0) return;
      const currentItems = itemsRef.current;
      const remaining = maxCount
        ? Math.max(
            0,
            maxCount -
              currentItems.filter((i) => i.status !== "canceled").length,
          )
        : undefined;
      const toUse =
        typeof remaining === "number" ? sources.slice(0, remaining) : sources;

      let newItems: UploadFileItem<TMeta, TFileSource>[] = toUse.map(
        (source) => ({
          uid: uid(),
          name: getFileNameRef.current(source),
          file: source,
          previewUrl: trackPreviewUrl(source),
          status: "idle" as const,
          progress: 0,
        }),
      );

      if (beforeUpload) {
        const result = await beforeUpload(newItems, {
          prevItems: currentItems,
          remaining,
          maxCount,
          accept,
        });
        if (result === false) {
          newItems.forEach((it) => {
            if (it.previewUrl) untrackPreviewUrl(it.previewUrl);
          });
          return;
        }

        if (Array.isArray(result)) {
          const resultMap = new Map(result.map((r) => [r.uid, r]));
          const processedItems: UploadFileItem<TMeta, TFileSource>[] = [];

          for (const item of newItems) {
            const validation = resultMap.get(item.uid);
            if (!validation) {
              if (item.previewUrl) untrackPreviewUrl(item.previewUrl);
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
              if (item.previewUrl) untrackPreviewUrl(item.previewUrl);
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
    [
      beforeUpload,
      emitChange,
      maxCount,
      startUpload,
      accept,
      trackPreviewUrl,
      untrackPreviewUrl,
    ],
  );

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
          if (item.previewUrl) {
            untrackPreviewUrl(item.previewUrl);
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
    [emitChange, onRemove, removeMode, startUpload, untrackPreviewUrl],
  );

  useEffect(
    () => () => {
      // Cleanup: revoke all tracked preview URLs and abort in-flight uploads
      blobUrlsRef.current.forEach((url) => revokePreviewUrlRef.current(url));
      blobUrlsRef.current.clear();
      controllers.current.forEach((c) => c.abort());
      removeControllers.current.forEach((c) => c.abort());
      removeControllers.current.clear();
    },
    [],
  );

  return {
    items,
    setItems,
    isLoading,
    emitChange,
    startUpload,
    selectFiles,
    actions,
    hiddenInputValue,
    name,
    controllers,
    blobUrlsRef,
    onLoadingChangeRef,
  };
}
