import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { View } from "react-native";
import { pick } from "@react-native-documents/picker";
import {
  ItemsCtx,
  StableCtx,
  UploaderCtx,
  useUplofileState,
} from "../shared/context";
import type {
  ImageUploaderContextValue,
  ItemActions,
  RootProps,
  UploadFileItem,
  UplofileRootRef,
  UploaderItemsContextValue,
  UploaderStableContextValue,
} from "../shared/types";
import { acceptsFile, getNativePickerAcceptTypes } from "../shared/utils";

export type { DocumentPickerResponse } from "@react-native-documents/picker";

export const Root = forwardRef(
  <TMeta = any,>(
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

    // Stable context — memoised separately so consumers that only read
    // actions/props don't re‑render on every progress tick.
    const stableCtx = useMemo<UploaderStableContextValue<TMeta, any>>(
      () => ({
        disabled: props.disabled,
        multiple: props.multiple ?? true,
        accept: props.accept ?? "image/*",
        actions: state.actions as ItemActions,
        openFileDialog,
        fileInputProps: {} as Record<string, any>,
        getDropzoneProps: () => ({}),
        setItems: state.setItems as any,
        name: props.name ?? "image",
      }),
      [
        props.disabled,
        props.multiple,
        props.accept,
        props.name,
        openFileDialog,
        state.actions,
        state.setItems,
      ],
    );

    // Items context — changes on every progress tick, kept separate so
    // consumers subscribed only to StableCtx don't re-render.
    const itemsCtx = useMemo<UploaderItemsContextValue<TMeta, any>>(
      () => ({
        items: state.items as UploadFileItem<TMeta, any>[],
        isLoading: state.isLoading,
        hiddenInputValue: state.hiddenInputValue,
      }),
      [state.items, state.isLoading, state.hiddenInputValue],
    );

    // Merged context
    const ctx = useMemo<ImageUploaderContextValue<TMeta, any>>(
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
      <StableCtx.Provider value={stableCtx}>
        <ItemsCtx.Provider value={itemsCtx}>
          <UploaderCtx.Provider value={ctx}>
            <View>{props.children}</View>
          </UploaderCtx.Provider>
        </ItemsCtx.Provider>
      </StableCtx.Provider>
    );
  },
);
