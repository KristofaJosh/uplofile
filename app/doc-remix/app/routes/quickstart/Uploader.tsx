import { Dropzone, Preview, Root, Trigger, type RootProps } from "uplofile";
import { upload } from "./upload";

export default function Uploader({
  uploadFile = upload,
}: {
  uploadFile?: RootProps["upload"];
}) {
  return (
    <Root upload={uploadFile} accept="*/*">
      <Dropzone className="rounded-lg border-2 border-dashed border-slate-400 p-8 text-center">
        Drop files here
      </Dropzone>
      <div className="mt-3 text-center">
        <Trigger className="cursor-pointer text-blue-600 underline">
          Or select files
        </Trigger>
      </div>
      <div className="mt-6">
        <Preview />
      </div>
    </Root>
  );
}
