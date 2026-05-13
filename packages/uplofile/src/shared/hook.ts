import { useContext } from "react";

import { UploaderCtx } from "./context";
import type { ImageUploaderContextValue } from "./types";

/**
 * useUplofile is the primary consumer hook. It must be called inside
 * the platform-specific Root provider (e.g. <Uplofile.Root> on web).
 *
 * Returns the full uploader context (items, actions, state flags, etc.) for
 * building custom upload UI.
 */
export const useUplofile = <TMeta = any, TFileSource = File>() => {
  const ctx = useContext(UploaderCtx) as ImageUploaderContextValue<
    TMeta,
    TFileSource
  > | null;
  if (!ctx)
    throw new Error("useUplofile hook must be used within <Uplofile.Root>");
  return ctx;
};
