import React, { createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { UploaderCtx, useUplofileState } from "../shared/context";
import type { ImageUploaderContextValue, RootProps, UploadFileItem, UplofileRootRef } from "../shared/types";
import { acceptsFile, uid } from "../shared/utils";

export const Root = forwardRef(<TMeta = any>(
  props: RootProps<TMeta, File>,
  ref: React.Ref<UplofileRootRef<TMeta, File>>,
) => {
  const inputRef = useRef<HTMLInputElement>(null!);
  const hasClickedRef = useRef(false);

  const state = useUplofileState<TMeta, File>({
    ...props,
    getFileName: (f) => f.name,
    createPreviewUrl: (f) => URL.createObjectURL(f),
    revokePreviewUrl: (url) => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    },
  });

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const accepted = Array.from(files).filter((f) => acceptsFile(f, props.accept));
    if (accepted.length === 0) return;
    void state.selectFiles(accepted);
    e.currentTarget.value = "";
  }, [state.selectFiles, props.accept]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (props.disabled) return;
    const dtFiles = e.dataTransfer?.files;
    if (!dtFiles || dtFiles.length === 0) return;
    const accepted = Array.from(dtFiles).filter((f) => acceptsFile(f, props.accept));
    if (accepted.length === 0) return;
    void state.selectFiles(accepted);
  }, [props.disabled, props.accept, state.selectFiles]);

  const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  const openFileDialog = useCallback(() => {
    if (!hasClickedRef.current) {
      hasClickedRef.current = true;
      inputRef.current?.click();
      setTimeout(() => { hasClickedRef.current = false; }, 100);
    }
  }, []);

  useEffect(() => {
    if (hasClickedRef.current) {
      const id = setTimeout(() => { hasClickedRef.current = false; }, 100);
      return () => clearTimeout(id);
    }
  }, [openFileDialog]);

  const getDropzoneProps = useCallback(() => ({
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
  }), [props.disabled, props.multiple, onDrop, onDragOver, openFileDialog]);

  const fileInputProps = useMemo(() => ({
    ref: inputRef,
    onChange: onInputChange,
    accept: (props.accept ?? "image/*") as string,
    multiple: props.multiple ?? true,
    disabled: props.disabled,
  }), [onInputChange, props.accept, props.multiple, props.disabled]);

  const ctx = useMemo<ImageUploaderContextValue<TMeta, File>>(() => ({
    items: state.items as UploadFileItem<TMeta, File>[],
    isLoading: state.isLoading,
    disabled: props.disabled,
    multiple: props.multiple ?? true,
    accept: props.accept ?? "image/*",
    actions: state.actions,
    openFileDialog,
    fileInputProps,
    getDropzoneProps,
    setItems: state.setItems as any,
    hiddenInputValue: state.hiddenInputValue,
    name: props.name ?? "image",
  }), [
    state.items, state.isLoading, state.actions, state.setItems,
    state.hiddenInputValue, props.disabled, props.multiple,
    props.accept, props.name, openFileDialog, fileInputProps, getDropzoneProps,
  ]);

  useImperativeHandle(ref, () => ({
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
  }), [state.emitChange, state.items, state.isLoading, onDrop, onDragOver, state.actions, openFileDialog, state.onLoadingChangeRef]);

  return (
    <UploaderCtx.Provider value={ctx}>
      <div data-part="root">
        <input type="file" hidden {...fileInputProps} />
        {props.children}
      </div>
    </UploaderCtx.Provider>
  );
});
