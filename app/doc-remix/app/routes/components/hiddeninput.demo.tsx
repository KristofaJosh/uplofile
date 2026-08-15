import { Dropzone, HiddenInput, Preview, Root, Trigger } from "uplofile";

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

export function AttachmentForm() {
  return (
    <form action="/api/posts" method="post">
      <Root upload={upload} name="attachments">
        <Dropzone>
          <Trigger>Select files</Trigger>
          <Preview />
        </Dropzone>

        {/* Posts done items as JSON: [{ id, name, url, meta? }]. */}
        <HiddenInput />
      </Root>
      <button type="submit">Publish</button>
    </form>
  );
}
