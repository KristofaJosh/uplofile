import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { ImagePlus, ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { mockUpload } from "@/lib/utils.ts";

export default function ImageGalleryDemo() {
  return (
    <UplofileRoot upload={mockUpload} accept="image/*" multiple>
      <UplofilePreview
        render={({ items }) => (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.uid}
                className="group relative aspect-square rounded-xl overflow-hidden bg-white border shadow-sm animate-in fade-in zoom-in-95 duration-200"
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}

                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-2">
                    <Loader2 className="h-6 w-6 text-white animate-spin mb-2" />
                    <div className="w-full bg-white/20 rounded-full h-1 max-w-[40px]">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {item.status === "done" && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-200">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                )}

                {item.status === "error" && (
                  <div className="absolute inset-0 bg-destructive/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-white animate-in zoom-in-95">
                    <AlertCircle className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Failed</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}

            <UplofileDropzone className="group aspect-square rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/10 data-[dragging=true]:scale-95">
              <UplofileTrigger>
                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                </div>
              </UplofileTrigger>
            </UplofileDropzone>
          </div>
        )}
      />
    </UplofileRoot>
  );
}
