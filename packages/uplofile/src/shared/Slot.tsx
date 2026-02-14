import React, { cloneElement, isValidElement } from "react";

export const Slot = ({
  children,
  ...props
}: { children: React.ReactNode } & Record<string, any>) => {
  if (isValidElement(children)) {
    return cloneElement(children, { ...children.props, ...props });
  }
  return children;
};
