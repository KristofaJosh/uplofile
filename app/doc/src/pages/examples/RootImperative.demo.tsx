import { useRef, DragEvent, useState } from "react";
import type { UplofileRootRef } from "uplofile";
import {
  UplofileDropzone,
  UplofilePreview,
  UplofileRoot,
} from "@/components/ui/uplofile.ts";
import { mockUpload } from "@/lib/utils.ts";

export default function RootImperativeDemo() {
  const uplofileRef = useRef<UplofileRootRef>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag events on the parent container
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    uplofileRef.current?.onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    uplofileRef.current?.onDrop(e);
  };

  const handleManualUpload = () => {
    uplofileRef.current?.openFileDialog();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] p-10 border-4 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-muted bg-muted/5"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Parent Container Dropzone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This entire area handles drag and drop imperatively via ref
        </p>
        <button
          onClick={handleManualUpload}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Open File Dialog via Ref
        </button>
      </div>

      <UplofileRoot ref={uplofileRef} upload={mockUpload}>
        <UplofilePreview />
        {/* We can still use the internal dropzone if we want */}
        <UplofileDropzone className="mt-4 border border-dashed p-4 rounded text-sm text-muted-foreground">
          Or drop specifically here
        </UplofileDropzone>
      </UplofileRoot>
    </div>
  );
}
