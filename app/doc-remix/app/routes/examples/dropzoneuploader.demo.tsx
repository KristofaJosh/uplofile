import { UplofileRoot, UplofilePreview } from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { DropTarget } from "./dropzoneuploader.droptarget.demo.tsx";
import { DropzoneFileItem } from "./dropzoneuploader.fileitem.demo.tsx";

export default function DropzoneUploaderDemo() {
  return (
    <UplofileRoot upload={mockUpload} accept="*/*" multiple>
      <DropTarget />

      <UplofilePreview
        render={({ items }) => (
          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <DropzoneFileItem key={item.uid} item={item} />
            ))}
          </div>
        )}
      />
    </UplofileRoot>
  );
}
