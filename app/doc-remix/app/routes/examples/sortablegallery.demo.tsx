import { UplofileRoot } from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { SortableGalleryGrid } from "./sortablegallery.grid.demo.tsx";

export default function SortableGalleryDemo() {
  return (
    <UplofileRoot upload={mockUpload} accept="image/*" multiple>
      <SortableGalleryGrid />
    </UplofileRoot>
  );
}
