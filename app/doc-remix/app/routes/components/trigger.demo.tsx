import { Root, Trigger } from "uplofile";

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

export function Uploader() {
  return (
    <Root upload={upload}>
      {/* Renders a <button> by default. */}
      <Trigger className="btn">Select files</Trigger>

      {/* render exposes live counts, so the label can change while uploading. */}
      <Trigger
        render={({ isUploading, uploadingCount }) => (
          <span>
            {isUploading ? `Uploading ${uploadingCount}…` : "Upload files"}
          </span>
        )}
      />
    </Root>
  );
}
