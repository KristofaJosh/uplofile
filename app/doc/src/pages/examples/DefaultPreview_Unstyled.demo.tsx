import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

export default function DefaultPreviewUnstyledDemo() {
  return (
    <UplofileRoot upload={mockUpload}>
      <UplofileTrigger>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow">
          Select Files
        </button>
      </UplofileTrigger>

      <div className="mt-8 border-t pt-8">
        <h3 className="text-sm font-medium mb-4">Unstyled Preview (Custom Render):</h3>
        <UplofilePreview
          render={({ items, actions }) => (
            <ul className="list-disc pl-5 space-y-2">
              {items.map((item) => (
                <li key={item.uid} className="text-sm">
                  {item.name} ({item.status})
                  <button
                    onClick={() => actions.remove(item.uid)}
                    className="ml-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        />
      </div>
    </UplofileRoot>
  );
}
