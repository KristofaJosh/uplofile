import { Slot } from "../shared/Slot";
import React, { ButtonHTMLAttributes } from "react";

import { useUplofile } from "./hook";
import { useUplofileSelector } from "../shared/hook";
import { isVideoFile } from "../shared/utils";

import type { PreviewRenderProps, UploadFileItem } from "../shared/types";

import { CancelIcon } from "./icons/CancelIcon";
import { ErrorIcon } from "./icons/ErrorIcon";
import { FileIcon } from "./icons/FileIcon";
import { RetryIcon } from "./icons/RetryIcon";
import { Spinner } from "./icons/Spinner";
import { TrashIcon } from "./icons/TrashIcon";

type WebUploadFileItem<TMeta = any> = UploadFileItem<TMeta, File>;

type Props<TMeta = any> = {
  render?: (api: PreviewRenderProps<TMeta, File>) => React.ReactNode;
  className?: string;
};

const ErrorBadge = () => (
  <div className="uplofile-preview__error-badge" aria-label="Error">
    <ErrorIcon />
  </div>
);

const VideoPreview = ({ item }: { item: WebUploadFileItem }) => (
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

const ImagePreview = ({ item }: { item: WebUploadFileItem }) => (
  <img
    src={item.url || item.previewUrl}
    alt={item.name}
    className="uplofile-preview__image"
  />
);

const FilePlaceholder = ({ item }: { item: WebUploadFileItem }) => (
  <div className="uplofile-preview__no-preview">
    <FileIcon />
    <span className="uplofile-preview__file-extension">
      {item.name.split(".").pop() || ""}
    </span>
  </div>
);

const MediaContent = ({ item }: { item: WebUploadFileItem }) => {
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

// Leaf-level isolation: subscribes to just this one item's progress value.
// A progress tick updates only this component — it never touches
// PreviewItem, MediaContent, or ActionButtons for the same item.
const ProgressLeaf = ({ uid }: { uid: string }) => {
  const progress = useUplofileSelector(
    (items) => items.find((i) => i.uid === uid)?.progress,
  );
  return <UploadingOverlay progress={progress} />;
};

type ActionButtonsProps = {
  item: WebUploadFileItem;
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

const isEqualIgnoringProgress = (
  a: WebUploadFileItem | undefined,
  b: WebUploadFileItem | undefined,
): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.uid === b.uid &&
    a.status === b.status &&
    a.name === b.name &&
    a.url === b.url &&
    a.previewUrl === b.previewUrl &&
    a.error === b.error &&
    a.file === b.file &&
    a.meta === b.meta
  );
};

// Reads everything except `progress` for this uid, so a progress tick never
// causes this component (or its non-progress children) to re-render — only
// ProgressLeaf, below, subscribes to progress.
// Exported (module-internal otherwise) so benchmark/regression tests can
// spy on it directly, same precedent as PR #45's renderIsolation test.
export const PreviewItem = React.memo(
  ({
    uid,
    actions,
  }: {
    uid: string;
    actions: PreviewRenderProps["actions"];
  }) => {
    const item = useUplofileSelector<WebUploadFileItem | undefined, any, File>(
      (items) => items.find((i) => i.uid === uid),
      isEqualIgnoringProgress,
    );

    if (!item) return null;

    const hasError = item.status === "error" || Boolean(item.error);
    const stateLabel =
      item.status === "removing"
        ? "Removing"
        : item.status === "uploading"
          ? "Uploading"
          : item.status === "error"
            ? "Error"
            : item.status === "canceled"
              ? "Canceled"
              : item.error
                ? "Done (error)"
                : "Done";

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="uplofile-preview__item"
        data-state={item.status}
        aria-label={`${item.name} - ${stateLabel}`}
        aria-busy={item.status === "uploading" || item.status === "removing"}
      >
        {hasError && <ErrorBadge />}
        <MediaContent item={item} />
        {item.status === "uploading" && <ProgressLeaf uid={uid} />}
        <div
          className="uplofile-preview__overlay"
          data-error={hasError ? "true" : undefined}
        >
          <ActionButtons item={item} actions={actions} />
          {hasError && (
            <span className="uplofile-preview__error-message">
              {item.error || "Upload failed"}
            </span>
          )}
        </div>
      </div>
    );
  },
);

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
          <PreviewItem key={item.uid} uid={item.uid} actions={actions} />
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
