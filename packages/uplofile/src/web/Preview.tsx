import { Slot } from "../shared/Slot";
import React, { ButtonHTMLAttributes } from "react";

import { useUplofile } from "../shared/hook";
import { isVideoFile } from "../shared/utils";

import type { PreviewRenderProps, UploadFileItem } from "../shared/types";

import { CancelIcon } from "./icons/CancelIcon";
import { ErrorIcon } from "./icons/ErrorIcon";
import { FileIcon } from "./icons/FileIcon";
import { RetryIcon } from "./icons/RetryIcon";
import { Spinner } from "./icons/Spinner";
import { TrashIcon } from "./icons/TrashIcon";

type Props<TMeta = any> = {
  render?: (api: PreviewRenderProps<TMeta>) => React.ReactNode;
  className?: string;
};

const ErrorBadge = () => (
  <div className="uplofile-preview__error-badge" aria-label="Error">
    <ErrorIcon />
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
    <FileIcon />
    <span className="uplofile-preview__file-extension">
      {item.name.split(".").pop() || ""}
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
    <Spinner className="uplofile-preview__spinner" />
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
        <CancelIcon />
      </button>
    )}
    {(item.status === "error" || item.status === "canceled") && (
      <button
        type="button"
        className="uplofile-preview__button uplofile-preview__button--retry"
        onClick={() => actions.retry(item.uid)}
        aria-label="Retry upload"
      >
        <RetryIcon />
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
        <Spinner className="uplofile-preview__spinner" />
      ) : (
        <TrashIcon />
      )}
    </button>
  </div>
);

const PreviewItem = ({
  item,
  actions,
}: {
  item: UploadFileItem;
  actions: PreviewRenderProps["actions"];
}) => {
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
      {item.status === "uploading" && (
        <UploadingOverlay progress={item.progress} />
      )}
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
      data-part="cancel"
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
      data-part="retry"
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
      data-part="remove"
      {...rest}
      onClick={(e: Event) => {
        e.stopPropagation();
        actions.remove(uid);
        rest.onClick?.(e as any);
      }}
    />
  );
};
