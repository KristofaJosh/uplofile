import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
  type UploadFileItem,
} from "@/components/ui/uplofile";

const onRemove = async (item: UploadFileItem, signal: AbortSignal) => {
  // remove logic
};

const upload = async (file, signal, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    signal,
  });

  // const res = await axios.post('/api/upload', formData, {
  //    onUploadProgress: onProgress
  // });

  if (!res.ok) throw new Error("Upload failed");
  return await res.json();
};

function FileUploader() {
  return (
    <UplofileRoot upload={upload} removeMode="strict" onRemove={onRemove}>
      <UplofileDropzone className="border-2 border-dashed rounded-lg p-8">
        <span>Drop files here or </span>
        <UplofileTrigger className="underline text-blue-500 cursor-pointer">
          Select files
        </UplofileTrigger>
        <div className="border-t my-6 py-6">
          <UplofilePreview />
        </div>
      </UplofileDropzone>
    </UplofileRoot>
  );
}
