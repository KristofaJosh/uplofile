import { useContext } from "react";

import { UploaderCtx } from "./context";

export const useImageUploader = () => {
  const ctx = useContext(UploaderCtx);
  if (!ctx)
    throw new Error(
      "ImageUploader components must be used within <ImageUploader.Root>",
    );
  return ctx;
};
