import React, { PropsWithChildren } from "react";

import { useUplofile } from "./hook";
import { useTriggerStats } from "../shared/triggerStats";
import type { TriggerRenderProps } from "../shared/types";
import { Slot } from "../shared/Slot";

export const Trigger = <TMeta = any,>({
  asChild,
  children,
  render,
  onClick,
  ...rest
}: PropsWithChildren<
  {
    asChild?: boolean;
    render?: (api: TriggerRenderProps<TMeta, File>) => React.ReactNode;
    children?:
      | React.ReactNode
      | ((api: TriggerRenderProps<TMeta, File>) => React.ReactNode);
  } & React.HTMLAttributes<HTMLElement>
>) => {
  const { openFileDialog, disabled, items, isLoading } = useUplofile<TMeta>();
  const Comp: any = asChild ? Slot : "button";

  const api = useTriggerStats(items, isLoading, openFileDialog);

  return (
    <Comp
      type={asChild ? undefined : "button"}
      aria-disabled={disabled}
      data-part="trigger"
      {...rest}
      onClick={(e: any) => {
        if (disabled) return;
        (onClick as any)?.(e);
        if (e.defaultPrevented) return;
        openFileDialog();
      }}
    >
      {render ? render(api) : children}
    </Comp>
  );
};
