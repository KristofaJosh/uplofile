import { Slot } from "@radix-ui/react-slot";
import React, { ButtonHTMLAttributes } from "react";

import { useImageUploader } from "../hook";

import type { PreviewRenderProps } from "../types";

type Props = {
  render?: (api: PreviewRenderProps) => React.ReactNode;
  className?: string;
};

export const Preview = ({ render, className }: Props) => {
  const { items, actions } = useImageUploader();

  if (render && typeof render === "function") {
    return render({ items, actions });
  }

  return (
    <div data-part="preview" className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.uid}
            onClick={(e) => e.stopPropagation()}
            className="relative overflow-hidden rounded-xl border"
            data-state={item.status}
          >
            {item.url || item.previewUrl ? (
              <img
                src={item.url || item.previewUrl}
                alt={item.name}
                className="h-32 w-full object-cover"
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center text-xs text-gray-500">
                No preview
              </div>
            )}
            {item.status === "uploading" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-black/80"
                  style={{
                    width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                  }}
                />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-2">
              {item.status === "uploading" && (
                <button
                  type="button"
                  className="rounded-xl bg-black/50 px-2 py-1 text-xs text-white"
                  onClick={() => actions.cancel(item.uid)}
                >
                  Cancel
                </button>
              )}
              {(item.status === "error" || item.status === "canceled") && (
                <button
                  type="button"
                  className="rounded-xl bg-black/50 px-2 py-1 text-xs text-white"
                  onClick={() => actions.retry(item.uid)}
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                className="rounded-xl bg-black/50 px-2 py-1 text-xs text-white"
                onClick={() => actions.remove(item.uid)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HiddenInput = ({ name }: { name?: string }) => {
  const { hiddenInputValue, name: defaultName } = useImageUploader();
  return (
    <input type="hidden" name={name ?? defaultName} value={hiddenInputValue} />
  );
};

type ButtonProps = {
  uid: string;
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Cancel = ({ uid, asChild, ...rest }: ButtonProps) => {
  const { actions } = useImageUploader();
  const Comp: any = asChild ? Slot : "button";
  return (
    <Comp
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        actions.cancel(uid);
      }}
      {...rest}
    />
  );
};

export const Retry = ({ uid, asChild, ...rest }: ButtonProps) => {
  const { actions } = useImageUploader();
  const Comp: any = asChild ? Slot : "button";
  return (
    <Comp
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        actions.retry(uid);
      }}
      {...rest}
    />
  );
};

export const Remove = ({ uid, asChild, ...rest }: ButtonProps) => {
  const { actions } = useImageUploader();
  const Comp: any = asChild ? Slot : "button";
  return (
    <Comp
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        actions.remove(uid);
      }}
      {...rest}
    />
  );
};
