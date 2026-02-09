import { Slot } from "@radix-ui/react-slot";
import React, { PropsWithChildren } from "react";

import { useUplofile } from "../hook";
import type { TriggerRenderProps } from "../types";

export const Trigger = <TMeta = any,>({
  asChild,
  children,
  render,
  ...rest
}: PropsWithChildren<
  {
    asChild?: boolean;
    render?: (api: TriggerRenderProps<TMeta>) => React.ReactNode;
    children?:
      | React.ReactNode
      | ((api: TriggerRenderProps<TMeta>) => React.ReactNode);
  } & React.HTMLAttributes<HTMLElement>
>) => {
  const { openFileDialog, disabled, items, isLoading } = useUplofile<TMeta>();
  const Comp: any = asChild ? Slot : "button";

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

  const api: TriggerRenderProps = {
    items,
    isLoading,
    isUploading: uploadingCount > 0,
    uploadingCount,
    doneCount,
    errorCount,
    totalProgress,
    open: openFileDialog,
  };

  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-disabled={disabled}
      data-part="trigger"
      onClick={(e: any) => {
        if (disabled) return;
        (rest as any).onClick?.(e);
        openFileDialog();
      }}
      {...rest}
    >
      {render ? render(api) : children}
    </Comp>
  );
};
