import React, { PropsWithChildren, useMemo } from "react";
import { Pressable, PressableProps, Text } from "react-native";
import { useUplofile } from "../shared/hook";
import type { TriggerRenderProps } from "../shared/types";

type NativeTriggerProps<TMeta = any> = PropsWithChildren<{
  render?: (api: TriggerRenderProps<TMeta>) => React.ReactNode;
}> & PressableProps;

export const Trigger = <TMeta = any>({
  children,
  render,
  ...rest
}: NativeTriggerProps<TMeta>) => {
  const { openFileDialog, disabled, items, isLoading } = useUplofile<TMeta>();

  const api = useMemo<TriggerRenderProps<TMeta>>(() => {
    const uploading = items.filter((i) => i.status === "uploading");
    const uploadingCount = uploading.length;
    const doneCount = items.filter((i) => i.status === "done").length;
    const errorCount = items.filter((i) => i.status === "error").length;
    const totalProgress = uploadingCount
      ? Math.round(
          uploading.reduce(
            (acc, it) =>
              acc + (typeof it.progress === "number" ? it.progress : 0),
            0,
          ) / uploadingCount,
        )
      : undefined;

    return {
      items,
      isLoading,
      isUploading: uploadingCount > 0,
      uploadingCount,
      doneCount,
      errorCount,
      totalProgress,
      open: openFileDialog,
    };
  }, [items, isLoading, openFileDialog]);

  return (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : openFileDialog}
      {...rest}
    >
      {render ? render(api) : (children ?? <Text>Select Files</Text>)}
    </Pressable>
  );
};
