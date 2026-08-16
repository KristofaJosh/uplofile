import { Dropzone, Preview, Root, Trigger } from "uplofile";

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

export function Uploader() {
  return (
    <Root upload={upload}>
      <Dropzone>
        <Trigger>Select files</Trigger>
        {/* No render prop: the built-in grid has thumbnails, progress, and actions. */}
        <Preview />
      </Dropzone>
    </Root>
  );
}
