import { useContext } from "react";

import { UploaderCtx } from "./context";
import type { ImageUploaderContextValue } from "./types";

export const useUplofile = <TMeta = any, TFileSource = unknown>() => {
  const ctx = useContext(UploaderCtx) as ImageUploaderContextValue<
    TMeta,
    TFileSource
  > | null;
  if (!ctx) throw new Error("useUplofile must be used within <Uplofile.Root>");
  return ctx;
};
