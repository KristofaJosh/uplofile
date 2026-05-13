import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  ItemsCtx,
  StableCtx,
  UploaderCtx,
  useUplofileState,
} from "../shared/context";
import type {
  ImageUploaderContextValue,
  RootProps,
  UploadFileItem,
  UplofileRootRef,
  UploaderItemsContextValue,
  UploaderStableContextValue,
} from "../shared/types";
import { acceptsFile } from "../shared/utils";

export const Root = forwardRef(
  <TMeta = any,>(
    props: RootProps<TMeta, File>,
    ref: React.Ref<UplofileRootRef<TMeta, File>>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const state = useUplofileState<TMeta, File>({
      ...props,
      getFileName: (f) => f.name,
      createPreviewUrl: (f) => URL.createObjectURL(f),
      revokePreviewUrl: (url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      },
    });

    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const accepted = Array.from(files).filter((f) =>
          acceptsFile(f, props.accept),
        );
        if (accepted.length === 0) return;
        void state.selectFiles(accepted);
        e.currentTarget.value = "";
      },
      [state.selectFiles, props.accept],
    );

    const onDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        if (props.disabled) return;
        const dtFiles = e.dataTransfer?.files;
        if (!dtFiles || dtFiles.length === 0) return;
        const accepted = Array.from(dtFiles).filter((f) =>
          acceptsFile(f, props.accept),
        );
        if (accepted.length === 0) return;
        void state.selectFiles(accepted);
      },
      [props.disabled, props.accept, state.selectFiles],
    );

    const onDragOver = useCallback(
      (e: React.DragEvent) => e.preventDefault(),
      [],
    );

    const openFileDialog = useCallback(() => {
      inputRef.current?.click();
    }, []);

    const getDropzoneProps = useCallback(
      () => ({
        role: "button" as const,
        tabIndex: 0,
        onDrop,
        onDragOver,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (props.disabled) return;
          if (e.key === "Enter" || e.key === " ") openFileDialog();
        },
        "data-disabled": props.disabled ? "" : undefined,
        "data-multiple": props.multiple ? "" : undefined,
      }),
      [props.disabled, props.multiple, onDrop, onDragOver, openFileDialog],
    );

    const fileInputProps = useMemo(
      () => ({
        ref: inputRef,
        onChange: onInputChange,
        accept: (props.accept ?? "image/*") as string,
        multiple: props.multiple ?? true,
        disabled: props.disabled,
      }),
      [onInputChange, props.accept, props.multiple, props.disabled],
    );

    // Stable context — memoised separately so consumers like Dropzone
    // that only read actions/props don't re‑render on every progress tick.
    const stableCtx = useMemo<UploaderStableContextValue<TMeta, File>>(
      () => ({
        disabled: props.disabled,
        multiple: props.multiple ?? true,
        accept: props.accept ?? "image/*",
        actions: state.actions,
        openFileDialog,
        fileInputProps,
        getDropzoneProps,
        setItems: state.setItems as any,
        name: props.name ?? "image",
      }),
      [
        props.disabled,
        props.multiple,
        props.accept,
        props.name,
        state.actions,
        state.setItems,
        openFileDialog,
        fileInputProps,
        getDropzoneProps,
      ],
    );

    // Items context — changes on every progress tick, kept separate so
    // consumers subscribed only to StableCtx don't re-render.
    const itemsCtx = useMemo<UploaderItemsContextValue<TMeta, File>>(
      () => ({
        items: state.items as UploadFileItem<TMeta, File>[],
        isLoading: state.isLoading,
        hiddenInputValue: state.hiddenInputValue,
      }),
      [state.items, state.isLoading, state.hiddenInputValue],
    );

    // Merged context
    const ctx = useMemo<ImageUploaderContextValue<TMeta, File>>(
      () => ({
        ...stableCtx,
        ...itemsCtx,
      }),
      [stableCtx, itemsCtx],
    );

    useImperativeHandle(
      ref,
      () => ({
        setItems: state.emitChange,
        getItems: () => state.items,
        isLoading: state.isLoading,
        onDrop,
        onDragOver,
        openFileDialog,
        actions: state.actions,
        get onLoadingChange() {
          return state.onLoadingChangeRef.current;
        },
        set onLoadingChange(callback) {
          state.onLoadingChangeRef.current = callback;
        },
      }),
      [
        state.emitChange,
        state.items,
        state.isLoading,
        onDrop,
        onDragOver,
        state.actions,
        openFileDialog,
        state.onLoadingChangeRef,
      ],
    );

    return (
      <StableCtx.Provider value={stableCtx}>
        <ItemsCtx.Provider value={itemsCtx}>
          <UploaderCtx.Provider value={ctx}>
            <div data-part="root">
              <input type="file" hidden {...fileInputProps} />
              {props.children}
            </div>
          </UploaderCtx.Provider>
        </ItemsCtx.Provider>
      </StableCtx.Provider>
    );
  },
);
