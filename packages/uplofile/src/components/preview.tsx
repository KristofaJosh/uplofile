import { Slot } from "../shared/Slot";
import React, { ButtonHTMLAttributes } from "react";

import { useUplofile } from "../hook";
import { isVideoFile } from "../utils";

import type { PreviewRenderProps, UploadFileItem } from "../types";

type Props<TMeta = any> = {
  render?: (api: PreviewRenderProps<TMeta>) => React.ReactNode;
  className?: string;
};

const ErrorBadge = () => (
  <div className="uplofile-preview__error-badge" aria-label="Error">
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
);

const VideoPreview = ({ item }: { item: UploadFileItem }) => (
  <video
    src={item.url || item.previewUrl}
    className="uplofile-preview__video"
    muted
    playsInline
    aria-label={item.name}
    onMouseOver={(e) => e.currentTarget.play()}
    onMouseOut={(e) => e.currentTarget.pause()}
  />
);

const ImagePreview = ({ item }: { item: UploadFileItem }) => (
  <img
    src={item.url || item.previewUrl}
    alt={item.name}
    className="uplofile-preview__image"
  />
);

const FilePlaceholder = ({ item }: { item: UploadFileItem }) => (
  <div className="uplofile-preview__no-preview">
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
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
    <span className="uplofile-preview__file-extension">
      {item.name.split(".").pop()}
    </span>
  </div>
);

const MediaContent = ({ item }: { item: UploadFileItem }) => {
  if (isVideoFile(item)) {
    return <VideoPreview item={item} />;
  }
  if (item.url || item.previewUrl) {
    return <ImagePreview item={item} />;
  }
  return <FilePlaceholder item={item} />;
};

const UploadingOverlay = ({ progress }: { progress?: number }) => (
  <div
    className="uplofile-preview__uploading-overlay"
    role="progressbar"
    aria-valuenow={progress ?? 0}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label="Uploading"
  >
    <svg
      className="uplofile-preview__spinner"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="uplofile-preview__spinner-track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="uplofile-preview__spinner-fill"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <div className="uplofile-preview__progress">
      <div
        className="uplofile-preview__progress-bar"
        style={{
          width: `${Math.max(0, Math.min(100, progress ?? 0))}%`,
        }}
      />
    </div>
  </div>
);

type ActionButtonsProps = {
  item: UploadFileItem;
  actions: PreviewRenderProps["actions"];
};

const ActionButtons = ({ item, actions }: ActionButtonsProps) => (
  <div className="uplofile-preview__actions">
    {item.status === "uploading" && (
      <button
        type="button"
        className="uplofile-preview__button uplofile-preview__button--cancel"
        onClick={() => actions.cancel(item.uid)}
        aria-label="Cancel upload"
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
        className="uplofile-preview__button uplofile-preview__button--retry"
        onClick={() => actions.retry(item.uid)}
        aria-label="Retry upload"
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
      className="uplofile-preview__button uplofile-preview__button--remove"
      onClick={() => actions.remove(item.uid)}
      disabled={item.status === "removing"}
      aria-label={`Remove ${item.name}`}
    >
      {item.status === "removing" ? (
        <svg
          className="uplofile-preview__spinner"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="uplofile-preview__spinner-track"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="uplofile-preview__spinner-fill"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
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
);

const PreviewItem = ({ item, actions }: { item: UploadFileItem; actions: PreviewRenderProps["actions"] }) => {
  const stateLabel =
    item.status === "removing"
      ? "Removing"
      : item.status === "uploading"
        ? "Uploading"
        : item.status === "error"
          ? "Error"
          : item.status === "canceled"
            ? "Canceled"
            : "Done";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="uplofile-preview__item"
      data-state={item.status}
      aria-label={`${item.name} - ${stateLabel}`}
      aria-busy={item.status === "uploading" || item.status === "removing"}
    >
      {item.status === "error" && <ErrorBadge />}
      <MediaContent item={item} />
      {item.status === "uploading" && <UploadingOverlay progress={item.progress} />}
      <div
        className="uplofile-preview__overlay"
        data-error={item.status === "error" ? "true" : undefined}
      >
        <ActionButtons item={item} actions={actions} />
        {item.status === "error" && (
          <span className="uplofile-preview__error-message">
            {item.error || "Upload failed"}
          </span>
        )}
      </div>
    </div>
  );
};

export const Preview = <TMeta = any,>({
  render,
  className = "",
}: Props<TMeta>) => {
  const { items, actions, setItems, isLoading } = useUplofile<TMeta>();

  if (render && typeof render === "function")
    return render({ items, setItems, actions, isLoading });

  if (items.length === 0) return null;

  return (
    <div data-part="preview" className="uplofile-preview">
      <div
        className={["uplofile-preview__wrapper", className].join(" ").trim()}
      >
        {items.map((item) => (
          <PreviewItem key={item.uid} item={item} actions={actions} />
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
