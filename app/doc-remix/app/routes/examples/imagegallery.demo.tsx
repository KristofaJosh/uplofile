import { UplofileRoot, UplofilePreview } from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { ImageItem } from "./imagegallery.imageitem.demo.tsx";
import { AddImageTile } from "./imagegallery.addtile.demo.tsx";

export default function ImageGalleryDemo() {
  return (
    <UplofileRoot upload={mockUpload} accept="image/*" multiple>
      <UplofilePreview
        render={({ items }) => (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <ImageItem key={item.uid} item={item} />
            ))}

            <AddImageTile />
          </div>
        )}
      />
    </UplofileRoot>
  );
}
