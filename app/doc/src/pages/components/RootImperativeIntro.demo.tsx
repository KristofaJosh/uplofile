import { useRef, DragEvent } from "react";
import type { UplofileRootRef } from "uplofile";
import {
  UplofileDropzone,
  UplofilePreview,
  UplofileRoot,
} from "@/components/ui/uplofile.ts";
import { mockUpload } from "@/lib/utils.ts";

export default function RootImperativeDemo() {
  const uplofileRef = useRef<UplofileRootRef>(null);

  // Use ref methods from parent
  const handleParentDrop = (e: DragEvent) => {
    uplofileRef.current?.onDrop(e);
  };

  const handleCustomUpdate = () => {
    // Update items programmatically
    uplofileRef.current?.setItems((prev) => [...prev]);

    // Or get current items
    const items = uplofileRef.current?.getItems();
  };

  let otherProps = {};
  return (
    <div
      className={"flex flex-col items-center justify-center h-full p-5"}
      onDrop={handleParentDrop}
    >
      <UplofileRoot ref={uplofileRef} upload={mockUpload} {...otherProps}>
        {/* Children still use context normally */}
        <UplofileDropzone className={"border-2 border-dashed p-8 rounded-lg"} />
        <UplofilePreview />
      </UplofileRoot>
    </div>
  );
}
