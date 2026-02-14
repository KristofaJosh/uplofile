import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";

export default function DropzoneDemo() {
  return (
    <UplofileRoot upload={async () => ({ url: "" })}>
      <UplofileDropzone className="border-2 border-dashed p-8 rounded-lg transition-colors data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5">
        <span>Drop files here or </span>
        <UplofileTrigger className="underline text-blue-500">
          click to browse
        </UplofileTrigger>
        <UplofilePreview />
      </UplofileDropzone>
    </UplofileRoot>
  );
}
