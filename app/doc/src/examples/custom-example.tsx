import {
  FileUploader,
  FileUploaderPreview,
  FileUploaderTrigger,
} from "@/components/ui/file-uploader.tsx";

const upload = async (file: File) => {
  return { url: URL.createObjectURL(file) };
};

export default function BasicExample() {
  return (
    <FileUploader upload={upload}>
      <FileUploaderPreview className={"size-10 my-2 rounded-lg"} />
      <FileUploaderTrigger className="rounded-lg border px-3 py-2">
        Select Image
      </FileUploaderTrigger>
    </FileUploader>
  );
}
