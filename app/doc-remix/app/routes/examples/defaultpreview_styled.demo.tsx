import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

export default function DefaultPreviewStyledDemo() {
  return (
    <UplofileRoot
      upload={mockUpload}
      initial={[
        {
          uid: "v1",
          name: "v1.mp4",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      ]}
    >
      <UplofileTrigger>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow">
          Select Files
        </button>
      </UplofileTrigger>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-sm font-medium mb-4">Default Preview:</h3>
        <UplofilePreview />
      </div>
    </UplofileRoot>
  );
}
