import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { View } from "react-native";
import {
  pick,
  type DocumentPickerResponse,
} from "@react-native-documents/picker";
import { UploaderCtx, useUplofileState } from "../shared/context";
import type { ItemActions } from "../shared/types";
import type {
  ImageUploaderContextValue,
  RootProps,
  UploadFileItem,
  UplofileRootRef,
} from "./types";
import { acceptsFile, getNativePickerAcceptTypes } from "../shared/utils";

export type { DocumentPickerResponse } from "@react-native-documents/picker";

const PICK_FILES_DEPRECATION_MESSAGE =
  "[uplofile] native Root is using the built-in @react-native-documents/picker fallback " +
  "because no `pickFiles` prop was passed. This fallback (and the @react-native-documents/picker " +
  "peer dependency) will be removed in the next major version. Pass `pickFiles` — see " +
  "adapterReactNativeDocumentsPicker, adapterExpoDocumentPicker, adapterExpoImagePicker, and " +
  "adapterReactNativeImagePicker exported from `uplofile/native` — or pass `suppressDeprecationWarnings` " +
  "to silence this warning.";

/**
 * `forwardRef`'s own typings erase a generic render function's type
 * parameters from the exported component's public type, collapsing
 * `TFileSource` (and `TMeta`) to their defaults for every consumer
 * regardless of what they pass to `pickFiles`/`upload`. Casting through
 * this call-signature type restores per-usage generic inference.
 */
type NativeRootComponent = <TMeta = any, TFileSource = DocumentPickerResponse>(
  props: RootProps<TMeta, TFileSource> & {
    ref?: React.Ref<UplofileRootRef<TMeta, TFileSource>>;
  },
) => React.ReactElement | null;

const RootImpl = forwardRef(
  <TMeta = any, TFileSource = DocumentPickerResponse>(
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

    const acceptTypes = useMemo(() => {
      return getNativePickerAcceptTypes(props.accept);
    }, [props.accept]);

    const hasWarnedRef = useRef(false);
    useEffect(() => {
      if (props.pickFiles || props.suppressDeprecationWarnings) return;
      if (hasWarnedRef.current) return;
      hasWarnedRef.current = true;
      console.warn(PICK_FILES_DEPRECATION_MESSAGE);
      // Intentionally mount-only: this reports the fallback in use at mount
      // time, guarded per-instance by the ref above rather than a
      // module-level flag, so every Root instance warns exactly once
      // regardless of how many other Root instances exist or have already
      // warned.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openFileDialog = useCallback(async () => {
      if (props.pickFiles) {
        try {
          const results = await props.pickFiles(props.accept, {
            multiple: props.multiple ?? true,
          });
          if (results.length > 0) {
            void state.selectFiles(results);
          }
        } catch {
          // Consumer-provided pickFiles rejected — treat as cancellation, no-op.
        }
        return;
      }

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
        ) as unknown as TFileSource[];
        if (accepted.length > 0) {
          void state.selectFiles(accepted);
        }
      } catch {
        // User cancelled the picker — no-op
      }
    }, [
      props.pickFiles,
      acceptTypes,
      props.accept,
      props.multiple,
      state.selectFiles,
    ]);

    const ctx = useMemo<ImageUploaderContextValue<TMeta, TFileSource>>(
      () => ({
        items: state.items as UploadFileItem<TMeta, TFileSource>[],
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

export const Root = RootImpl as unknown as NativeRootComponent;
