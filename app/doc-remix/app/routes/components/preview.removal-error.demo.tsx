import { Dropzone, Preview, Root } from "uplofile";

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

export function Uploader() {
  return (
    <Root
      upload={upload}
      onRemove={async (item, signal) => {
        const response = await fetch(`/api/files/${item.id}`, {
          method: "DELETE",
          signal,
        });
        if (!response.ok) throw new Error("Delete failed");
      }}
    >
      <Dropzone>
        {/* If onRemove throws/rejects, the item stays at status "done" with
            error set — Preview shows the same badge/message it uses for a
            failed upload, no extra wiring required. */}
        <Preview />
      </Dropzone>
    </Root>
  );
}
