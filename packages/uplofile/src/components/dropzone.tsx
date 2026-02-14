import { Slot } from "../shared/Slot";
import { HTMLAttributes, useCallback, useRef, useState } from "react";

import { useUplofile } from "../hook";

export type DropzoneProps = {
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>;

export const Dropzone = ({ asChild, ...rest }: DropzoneProps) => {
  const { getDropzoneProps, disabled } = useUplofile();
  const Comp: any = asChild ? Slot : "div";
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const resetDragState = useCallback(() => {
    dragCounter.current = 0;
    setIsDragging(false);
  }, []);

  const dropzoneProps = getDropzoneProps();
  const {
    onDrop,
    onDragOver,
    onKeyDown,
    ...restDropzoneProps
  } = dropzoneProps;

  return (
    <Comp
      data-part="dropzone"
      data-dragging={isDragging ? "true" : undefined}
      {...restDropzoneProps}
      {...rest}
      onDragOver={(e: any) => {
        (rest as any).onDragOver?.(e);
        if (e.defaultPrevented) return;
        onDragOver(e);
      }}
      onDragEnter={(e: any) => {
        if (disabled) return;
        (rest as any).onDragEnter?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        dragCounter.current += 1;
        setIsDragging(true);
      }}
      onDragLeave={(e: any) => {
        if (disabled) return;
        (rest as any).onDragLeave?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        dragCounter.current = Math.max(0, dragCounter.current - 1);
        if (dragCounter.current === 0) setIsDragging(false);
      }}
      onDrop={(e: any) => {
        resetDragState();
        (rest as any).onDrop?.(e);
        if (e.defaultPrevented) return;
        onDrop(e);
      }}
      onKeyDown={(e: any) => {
        (rest as any).onKeyDown?.(e);
        if (e.defaultPrevented) return;
        onKeyDown(e);
      }}
    />
  );
};
