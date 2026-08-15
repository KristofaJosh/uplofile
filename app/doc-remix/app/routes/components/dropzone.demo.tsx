import { Dropzone, Preview, Root, Trigger } from "uplofile";

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

export function Uploader() {
  return (
    <Root upload={upload}>
      {/* data-dragging="true" while a file hovers over the zone. */}
      <Dropzone className="rounded-lg border border-dashed p-8 data-[dragging=true]:border-accent">
        Drop files here, or <Trigger>browse</Trigger>
        <Preview />
      </Dropzone>
    </Root>
  );
}
