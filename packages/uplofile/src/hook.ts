import { useContext } from "react";

import { UploaderCtx } from "./context";
import type { ImageUploaderContextValue } from "./types";

export const useUplofile = <TMeta = any>() => {
  const ctx = useContext(
    UploaderCtx,
  ) as ImageUploaderContextValue<TMeta> | null;
  if (!ctx)
    throw new Error("useUplofile hook must be used within <Uplofile.Root>");
  return ctx;
};
