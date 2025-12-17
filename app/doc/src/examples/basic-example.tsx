import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile.ts";
import { upload } from "@/utils/upload-simulator.ts";

export default function BasicExample() {
  return (
    <UplofileRoot upload={upload}>
      <UplofileTrigger className="cursor-pointer rounded-lg border px-3 py-2">
        Select Image
      </UplofileTrigger>
      <UplofilePreview />
    </UplofileRoot>
  );
}
