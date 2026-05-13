import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from "react";
import { View } from "react-native";
import { pick } from "react-native-document-picker";
import { UploaderCtx, useUplofileState } from "../shared/context";
import type {
  ImageUploaderContextValue,
  ItemActions,
  RootProps,
  UploadFileItem,
  UplofileRootRef,
} from "../shared/types";

export type { DocumentPickerResponse } from "react-native-document-picker";

export const Root = forwardRef(<TMeta = any>(
  props: RootProps<TMeta, any>,
  ref: React.Ref<UplofileRootRef<TMeta, any>>,
) => {
  const state = useUplofileState<TMeta, any>({
    ...props,
    getFileName: (source: any) => source?.name ?? "unknown",
    createPreviewUrl: (source: any) => source?.uri ?? undefined,
    revokePreviewUrl: () => {},
  });

  const acceptTypes = useMemo(() => {
    if (!props.accept) return undefined;
    return props.accept
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [props.accept]);

  const openFileDialog = useCallback(async () => {
    try {
      const results = await pick({
        type: acceptTypes,
      });
      if (results && results.length > 0) {
        void state.selectFiles(results);
      }
    } catch {
      // User cancelled the picker — no-op
    }
  }, [acceptTypes, state.selectFiles]);

  const onDrop = undefined;
  const onDragOver = undefined;

  const ctx = useMemo<ImageUploaderContextValue<TMeta, any>>(() => ({
    items: state.items as UploadFileItem<TMeta, any>[],
    setItems: state.setItems as any,
    isLoading: state.isLoading,
    disabled: props.disabled,
    multiple: props.multiple ?? true,
    accept: props.accept ?? "image/*",
    actions: state.actions as ItemActions,
    openFileDialog,
    fileInputProps: {} as Record<string, any>,
    getDropzoneProps: () => ({}),
    hiddenInputValue: state.hiddenInputValue,
    name: props.name ?? "image",
  }), [
    state.items, state.setItems, state.isLoading, state.hiddenInputValue,
    props.disabled, props.multiple, props.accept, props.name,
    openFileDialog, state.actions,
  ]);

  useImperativeHandle(ref, () => ({
    setItems: state.emitChange,
    getItems: () => state.items,
    isLoading: state.isLoading,
    openFileDialog,
    actions: state.actions,
  }), [state.emitChange, state.items, state.isLoading, openFileDialog, state.actions]);

  return (
    <UploaderCtx.Provider value={ctx}>
      <View>{props.children}</View>
    </UploaderCtx.Provider>
  );
});
