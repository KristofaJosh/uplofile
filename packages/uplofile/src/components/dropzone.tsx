import { Slot } from "../shared/Slot";
import { HTMLAttributes } from "react";

import { useUplofile } from "../hook";

export type DropzoneProps = {
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const Dropzone = ({ asChild, ...rest }: DropzoneProps) => {
  const { getDropzoneProps } = useUplofile();
  const Comp: any = asChild ? Slot : "div";
  return (
    <Comp data-part="dropzone" {...getDropzoneProps()} {...rest} />
  );
};
