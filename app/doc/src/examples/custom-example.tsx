import {
  UplofileRoot,
  UplofilePreview,
  UplofileTrigger,
} from "@/components/ui/file-uploader.tsx";
import { upload } from "@/utils/upload-simulator.ts";

export default function BasicExample() {
  return (
    <UplofileRoot upload={upload}>
      <UplofilePreview />
      <UplofileTrigger className="rounded-lg border px-3 py-2">
        Select Image
      </UplofileTrigger>
    </UplofileRoot>
  );
}
