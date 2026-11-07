import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from "react";
import { View } from "react-native";
import { UploaderCtx, useUplofileState } from "../shared/context";
import type { ItemActions, StableUploaderCtxValue } from "../shared/types";
import type { NativeFile, RootProps, UplofileRootRef } from "./types";

/**
 * `forwardRef`'s own typings erase a generic render function's type
 * parameters from the exported component's public type, collapsing
 * `TFileSource` (and `TMeta`) to their defaults for every consumer
 * regardless of what they pass to `pickFiles`/`upload`. Casting through
 * this call-signature type restores per-usage generic inference.
 */
type NativeRootComponent = <TMeta = any, TFileSource = NativeFile>(
  props: RootProps<TMeta, TFileSource> & {
    ref?: React.Ref<UplofileRootRef<TMeta, TFileSource>>;
  },
) => React.ReactElement | null;

const RootImpl = forwardRef(
  <TMeta = any, TFileSource = NativeFile>(
    props: RootProps<TMeta, TFileSource>,
    ref: React.Ref<UplofileRootRef<TMeta, TFileSource>>,
  ) => {
    const state = useUplofileState<TMeta, TFileSource>({
      ...props,
      getFileName: (source) =>
        (source as { name?: string } | null | undefined)?.name ?? "unknown",
      createPreviewUrl: (source) =>
        (source as { uri?: string } | null | undefined)?.uri ?? undefined,
      revokePreviewUrl: () => {},
    });

    const openFileDialog = useCallback(async () => {
      try {
        const results = await props.pickFiles(props.accept, {
          multiple: props.multiple ?? true,
        });
        void state.selectFiles(results);
      } catch (error) {
        // Adapters resolve [] on cancel, so a rejection is a real failure
        // (e.g. a denied permission). Surface it instead of dropping it.
        if (props.onPickError) props.onPickError(error);
        else console.warn("[uplofile] pickFiles failed:", error);
      }
    }, [
      props.pickFiles,
      props.accept,
      props.multiple,
      props.onPickError,
      state.selectFiles,
    ]);

    const ctx = useMemo<StableUploaderCtxValue<TMeta, TFileSource>>(
      () => ({
        store: state.store,
        isLoading: state.isLoading,
        disabled: props.disabled,
        multiple: props.multiple ?? true,
        accept: props.accept ?? "image/*",
        actions: state.actions as ItemActions,
        openFileDialog,
        fileInputProps: {} as Record<string, any>,
        getDropzoneProps: () => ({}),
        name: props.name ?? "image",
      }),
      [
        state.store,
        state.isLoading,
        props.disabled,
        props.multiple,
        props.accept,
        props.name,
        state.actions,
        openFileDialog,
      ],
    );

    useImperativeHandle(
      ref,
      () => ({
        setItems: state.store.setItems,
        getItems: () => state.store.getSnapshot(),
        isLoading: state.isLoading,
        openFileDialog,
        actions: state.actions,
      }),
      [
        state.store,
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

export const Root = RootImpl as unknown as NativeRootComponent;
