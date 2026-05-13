import { useContext } from "react";

import { ItemsCtx, StableCtx, UploaderCtx } from "./context";
import type {
  ImageUploaderContextValue,
  UploaderItemsContextValue,
  UploaderStableContextValue,
} from "./types";

/**
 * Subscribe to the stable (infrequently-changing) context.
 * Use this instead of `useUplofile` when you only need actions, callbacks,
 * or props — avoids re-rendering on every progress tick.
 */
export const useUplofileStable = <TMeta = any, TFileSource = File>() => {
  const ctx = useContext(
    StableCtx,
  ) as UploaderStableContextValue<TMeta, TFileSource> | null;
  if (!ctx)
    throw new Error(
      "useUplofileStable must be used within <Uplofile.Root>",
    );
  return ctx;
};

/**
 * Subscribe to the items context (frequently-changing values).
 * Use this when you only need items/isLoading — avoids stale closures
 * on stable values and isolates re-renders.
 */
export const useUplofileItems = <TMeta = any, TFileSource = File>() => {
  const ctx = useContext(
    ItemsCtx,
  ) as UploaderItemsContextValue<TMeta, TFileSource> | null;
  if (!ctx)
    throw new Error("useUplofileItems must be used within <Uplofile.Root>");
  return ctx;
};

export const useUplofile = <TMeta = any, TFileSource = File>() => {
  const ctx = useContext(
    UploaderCtx,
  ) as ImageUploaderContextValue<TMeta, TFileSource> | null;
  if (!ctx)
    throw new Error("useUplofile must be used within <Uplofile.Root>");
  return ctx;
};
