import { Slot } from "@radix-ui/react-slot";
import { HTMLAttributes } from "react";

import { useImageUploader } from "../hook";

export const Dropzone = ({
  asChild,
  ...rest
}: { asChild?: boolean } & HTMLAttributes<HTMLElement>) => {
  const { getDropzoneProps } = useImageUploader();
  const Comp: any = asChild ? Slot : "div";
  return <Comp data-part="dropzone" {...getDropzoneProps()} {...rest} />;
};
