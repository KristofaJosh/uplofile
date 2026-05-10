import { useContext } from "react";

import { UploaderCtx } from "./context";
import type { ImageUploaderContextValue } from "./types";

/**
 * useUplofile is the primary consumer hook. It must be called inside <Uplofile.Root>.
 *
 * Returns the full uploader context (items, actions, state flags, etc.) for
 * building custom upload UI.
 */
export const useUplofile = <TMeta = any>() => {
  const ctx = useContext(
    UploaderCtx,
  ) as ImageUploaderContextValue<TMeta> | null;
  if (!ctx)
    throw new Error("useUplofile hook must be used within <Uplofile.Root>");
  return ctx;
};
