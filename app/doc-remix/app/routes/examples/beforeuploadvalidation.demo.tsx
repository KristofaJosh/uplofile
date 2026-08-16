import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { beforeUpload } from "./beforeuploadvalidation.rule.demo.tsx";
import { ValidationFileItem } from "./beforeuploadvalidation.fileitem.demo.tsx";

export default function BeforeUploadValidationDemo() {
  return (
    <UplofileRoot upload={mockUpload} beforeUpload={beforeUpload}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Validation: Max 2MB, no "restricted" in filename.
        </p>
        <UplofileTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow">
            Select Files
          </button>
        </UplofileTrigger>

        <UplofilePreview
          render={({ items }) => (
            <div className="mt-6 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed rounded-lg bg-muted/5">
                  <p className="text-muted-foreground text-sm">
                    No files selected
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {items.map((item) => (
                    <ValidationFileItem key={item.uid} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </UplofileRoot>
  );
}
