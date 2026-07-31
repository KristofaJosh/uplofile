import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { View } from "react-native";
import { pick, type DocumentPickerResponse } from "@react-native-documents/picker";
import { UploaderCtx, useUplofileState } from "../shared/context";
import type {
  ImageUploaderContextValue,
  ItemActions,
  RootProps,
  UploadFileItem,
} from "../shared/types";
import type { UplofileRootRef } from "./types";
import { acceptsFile, getNativePickerAcceptTypes } from "../shared/utils";

export type { DocumentPickerResponse } from "@react-native-documents/picker";

export const Root = forwardRef(
  <TMeta = any,>(
    props: RootProps<TMeta, DocumentPickerResponse>,
    ref: React.Ref<UplofileRootRef<TMeta, DocumentPickerResponse>>,
  ) => {
    const state = useUplofileState<TMeta, DocumentPickerResponse>({
      ...props,
      getFileName: (source) => source?.name ?? "unknown",
      createPreviewUrl: (source) => source?.uri ?? undefined,
      revokePreviewUrl: () => {},
    });

    const acceptTypes = useMemo(() => {
      return getNativePickerAcceptTypes(props.accept);
    }, [props.accept]);

    const openFileDialog = useCallback(async () => {
      try {
        const results = await pick({
          type: acceptTypes,
          allowMultiSelection: props.multiple ?? true,
        });
        const accepted = results.filter((result) =>
          acceptsFile(
            {
              name: result.name ?? "",
              type: result.type ?? "",
            },
            props.accept,
          ),
        );
        if (accepted.length > 0) {
          void state.selectFiles(accepted);
        }
      } catch {
        // User cancelled the picker — no-op
      }
    }, [acceptTypes, props.accept, props.multiple, state.selectFiles]);

    const onDrop = undefined;
    const onDragOver = undefined;

    const ctx = useMemo<ImageUploaderContextValue<TMeta, DocumentPickerResponse>>(
      () => ({
        items: state.items as UploadFileItem<TMeta, DocumentPickerResponse>[],
        setItems: state.setItems,
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
      }),
      [
        state.items,
        state.setItems,
        state.isLoading,
        props.disabled,
        props.multiple,
        props.accept,
        props.name,
        state.actions,
        state.hiddenInputValue,
        openFileDialog,
      ],
    );

    useImperativeHandle(
      ref,
      () => ({
        setItems: state.emitChange,
        getItems: () => state.items,
        isLoading: state.isLoading,
        openFileDialog,
        actions: state.actions,
      }),
      [
        state.emitChange,
        state.items,
        state.isLoading,
        openFileDialog,
        state.actions,
      ],
    );

    return (
      <UploaderCtx.Provider value={ctx}>
        <View>{props.children}</View>
      </UploaderCtx.Provider>
    );
  },
);
