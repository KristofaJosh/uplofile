import { Slot } from "@radix-ui/react-slot";
import React, { ButtonHTMLAttributes } from "react";

import { useUplofile } from "../hook";
import { isVideoFile } from "../utils";

import type { PreviewRenderProps } from "../types";

type Props<TMeta = any> = {
  render?: (api: PreviewRenderProps<TMeta>) => React.ReactNode;
};

export const Preview = <TMeta = any>({ render }: Props<TMeta>) => {
  const { items, actions, setItems } = useUplofile<TMeta>();

  if (render && typeof render === "function")
    return render({ items, setItems, actions });

  if (items.length === 0) return null;

  return (
    <div data-part="preview" className="uplofile-preview">
      <div className="uplofile-preview__wrapper grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.uid}
            onClick={(e) => e.stopPropagation()}
            className={`uplofile-preview__item group relative aspect-square overflow-hidden rounded-xl border bg-muted/5 transition-all ${
              item.status === "error"
                ? "border-red-200 bg-red-50/30 hover:shadow-md"
                : "hover:shadow-md hover:ring-2 hover:ring-primary/20"
            }`}
            data-state={item.status}
          >
            {item.status === "error" && (
              <div className="absolute right-2 top-2 z-10 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-opacity group-hover:opacity-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            )}
            {isVideoFile(item) ? (
              <video
                src={item.url || item.previewUrl}
                className="uplofile-preview__video w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                muted
                playsInline
                onMouseOver={(e) => e.currentTarget.play()}
                onMouseOut={(e) => e.currentTarget.pause()}
              />
            ) : item.url || item.previewUrl ? (
              <img
                src={item.url || item.previewUrl}
                alt={item.name}
                className="uplofile-preview__image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="uplofile-preview__no-preview flex w-full h-full flex-col items-center justify-center gap-2 text-muted-foreground/40 bg-muted/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="max-w-[80%] truncate text-[10px] font-bold uppercase tracking-widest opacity-60">
                  {item.name.split(".").pop()}
                </span>
              </div>
            )}

            {item.status === "uploading" && (
              <div className="uplofile-preview__uploading-overlay absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <svg
                  className="mb-2 size-6 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <div className="uplofile-preview__progress h-1 w-12 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="uplofile-preview__progress-bar h-full bg-white transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, item.progress ?? 0))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div
              className={`uplofile-preview__overlay absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 transition-all duration-200 group-hover:opacity-100 ${
                item.status === "error"
                  ? "bg-red-950/70 opacity-0 backdrop-blur-[1px]"
                  : "bg-black/40 opacity-0"
              }`}
            >
              <div className="flex gap-2">
                {item.status === "uploading" && (
                  <button
                    type="button"
                    className="uplofile-preview__button uplofile-preview__button--cancel flex size-9 items-center justify-center rounded-xl bg-white/90 text-black shadow-lg transition-transform hover:scale-110 active:scale-95"
                    onClick={() => actions.cancel(item.uid)}
                    title="Cancel"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </button>
                )}
                {(item.status === "error" || item.status === "canceled") && (
                  <button
                    type="button"
                    className="uplofile-preview__button uplofile-preview__button--retry flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
                    onClick={() => actions.retry(item.uid)}
                    title="Retry"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className={`uplofile-preview__button uplofile-preview__button--remove flex size-9 items-center justify-center rounded-xl transition-all hover:scale-110 active:scale-95 text-red-600`}
                  onClick={() => actions.remove(item.uid)}
                  disabled={item.status === "removing"}
                  title="Remove"
                >
                  {item.status === "removing" ? (
                    <svg
                      className="size-5 animate-spin text-inherit"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  )}
                </button>
              </div>
              {item.status === "error" && (
                <span className="mt-1 px-3 text-center text-[10px] font-bold text-white drop-shadow-md line-clamp-2">
                  {item.error || "Upload failed"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HiddenInput = ({ name }: { name?: string }) => {
  const { hiddenInputValue, name: defaultName } = useUplofile();
  return (
    <input type="hidden" name={name ?? defaultName} value={hiddenInputValue} />
  );
};

type ButtonProps = {
  uid: string;
  alwaysVisible?: boolean;
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Cancel = ({
  uid,
  asChild,
  alwaysVisible = false,
  ...rest
}: ButtonProps) => {
  const { actions, items } = useUplofile();
  const isUploading = items.find((i) => i.uid === uid)?.status === "uploading";
  const Comp: any = asChild ? Slot : "button";

  if (!isUploading && !alwaysVisible) return null;

  return (
    <Comp
      {...rest}
      onClick={(e: Event) => {
        e.stopPropagation();
        actions.cancel(uid);
        rest.onClick?.(e as any);
      }}
    />
  );
};

export const Retry = ({ uid, asChild, ...rest }: ButtonProps) => {
  const { actions } = useUplofile();
  const Comp: any = asChild ? Slot : "button";
  return (
    <Comp
      {...rest}
      onClick={(e: Event) => {
        e.stopPropagation();
        actions.retry(uid);
        rest.onClick?.(e as any);
      }}
    />
  );
};

export const Remove = ({ uid, asChild, ...rest }: ButtonProps) => {
  const { actions } = useUplofile();
  const Comp: any = asChild ? Slot : "button";
  return (
    <Comp
      {...rest}
      onClick={(e: Event) => {
        e.stopPropagation();
        actions.remove(uid);
        rest.onClick?.(e as any);
      }}
    />
  );
};
