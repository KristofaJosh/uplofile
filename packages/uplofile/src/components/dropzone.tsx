import { Slot } from "../shared/Slot";
import { HTMLAttributes } from "react";

import { useUplofile } from "../hook";

export type DropzoneClassNameProps = {
  isDragging: boolean;
  disabled?: boolean;
  multiple: boolean;
};

export type DropzoneProps = {
  asChild?: boolean;
  className?: string | ((props: DropzoneClassNameProps) => string);
} & Omit<HTMLAttributes<HTMLElement>, "className">;

export const Dropzone = ({
  asChild,
  className,
  ...rest
}: DropzoneProps) => {
  const { getDropzoneProps, isDragging, disabled, multiple } = useUplofile();
  const Comp: any = asChild ? Slot : "div";
  const resolvedClassName =
    typeof className === "function"
      ? className({ isDragging, disabled, multiple })
      : className;
  return (
    <Comp
      data-part="dropzone"
      {...getDropzoneProps()}
      {...rest}
      className={resolvedClassName}
    />
  );
};
