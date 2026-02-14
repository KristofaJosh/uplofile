import { Slot } from "../shared/Slot";
import { HTMLAttributes } from "react";

import { useUplofile } from "../hook";

export const Dropzone = ({
  asChild,
  ...rest
}: { asChild?: boolean } & HTMLAttributes<HTMLElement>) => {
  const { getDropzoneProps } = useUplofile();
  const Comp: any = asChild ? Slot : "div";
  return <Comp data-part="dropzone" {...getDropzoneProps()} {...rest} />;
};
