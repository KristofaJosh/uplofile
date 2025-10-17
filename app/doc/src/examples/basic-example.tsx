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
      <FileUploaderTrigger className="cursor-pointer rounded-lg border px-3 py-2">
        Select Image
      </FileUploaderTrigger>
      <FileUploaderPreview />
    </FileUploader>
  );
}
