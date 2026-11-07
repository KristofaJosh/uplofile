import React, { PropsWithChildren } from "react";
import { Pressable, PressableProps, Text } from "react-native";
import type { NativeFile } from "./types";

import { useUplofile } from "./hook";
import { useTriggerStats } from "../shared/triggerStats";
import type { TriggerRenderProps } from "../shared/types";

type NativeTriggerProps<TMeta = any> = PropsWithChildren<{
  render?: (
    api: TriggerRenderProps<TMeta, NativeFile>,
  ) => React.ReactNode;
}> &
  PressableProps;

export const Trigger = <TMeta = any,>({
  children,
  render,
  ...rest
}: NativeTriggerProps<TMeta>) => {
  const { openFileDialog, disabled, items, isLoading } = useUplofile<TMeta>();

  const api = useTriggerStats(items, isLoading, openFileDialog);

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
