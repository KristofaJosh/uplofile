import { useContext, useMemo } from "react";

import { UploaderItemsCtx, UploaderStableCtx } from "./context";
import type { ImageUploaderContextValue, UploadFileItem } from "./types";

const NOT_IN_ROOT_ERROR = "useUplofile must be used within <Uplofile.Root>";

export const useUplofile = <TMeta = any, TFileSource = unknown>() => {
  const stable = useContext(UploaderStableCtx) as Omit<
    ImageUploaderContextValue<TMeta, TFileSource>,
    "items"
  > | null;
  const items = useContext(UploaderItemsCtx) as
    | UploadFileItem<TMeta, TFileSource>[]
    | null;
  if (!stable || !items) throw new Error(NOT_IN_ROOT_ERROR);
  return useMemo(
    () =>
      ({ ...stable, items }) as ImageUploaderContextValue<TMeta, TFileSource>,
    [stable, items],
  );
};

// Internal-only: subscribes to the stable half of the context, skipping the
// `items` context so progress ticks don't re-render the consumer. Used by
// components (e.g. Dropzone) that never read `items`.
export const useUplofileStable = <TMeta = any, TFileSource = unknown>() => {
  const stable = useContext(UploaderStableCtx) as Omit<
    ImageUploaderContextValue<TMeta, TFileSource>,
    "items"
  > | null;
  if (!stable) throw new Error(NOT_IN_ROOT_ERROR);
  return stable;
};
