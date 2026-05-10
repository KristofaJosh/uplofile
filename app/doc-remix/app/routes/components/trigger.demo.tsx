import { UplofileRoot, UplofileTrigger } from "@/components/ui/uplofile";

export default function TriggerDemo() {
  return (
    <UplofileRoot upload={async () => ({ url: "" })}>
      {/* Simple Trigger */}
      <UplofileTrigger className="underline text-blue-500">
        Select files
      </UplofileTrigger>

      {/* Trigger with Render Props */}
      <UplofileTrigger
        render={({ isUploading, doneCount, uploadingCount }) => (
          <span>
            {isUploading
              ? `Uploading ${uploadingCount} files...`
              : "Upload files"}
          </span>
        )}
      />
    </UplofileRoot>
  );
}
