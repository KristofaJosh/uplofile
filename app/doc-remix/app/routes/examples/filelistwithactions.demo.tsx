import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { IoAddOutline, IoDocumentOutline } from "react-icons/io5";
import { mockUpload } from "@/lib/utils.ts";
import { FileItem } from "./filelistwithactions.fileitem.demo.tsx";

export default function FileListWithActionsDemo() {
  return (
    <UplofileRoot upload={mockUpload} multiple>
      <UplofileTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm font-medium text-sm active:scale-95">
          <IoAddOutline className="h-4 w-4" />
          Add Files
        </button>
      </UplofileTrigger>

      <UplofilePreview
        render={({ items }) => (
          <div className="mt-6 divide-y divide-border border rounded-xl bg-card shadow-sm overflow-hidden">
            {items.length === 0 && (
              <div className="p-12 text-center">
                <IoDocumentOutline className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No files added yet.
                </p>
              </div>
            )}
            {items.map((item) => (
              <FileItem key={item.uid} item={item} />
            ))}
          </div>
        )}
      />
    </UplofileRoot>
  );
}
