import { useContext } from "react";

import { UploaderCtx } from "./context";

export const useUplofile = () => {
  const ctx = useContext(UploaderCtx);
  if (!ctx)
    throw new Error(
      "useUplofile hook must be used within <Uplofile.Root>",
    );
  return ctx;
};
