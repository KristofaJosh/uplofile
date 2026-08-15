import type { UploadFileItem } from "@/components/ui/uplofile";
import {
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoImageOutline,
  IoReloadOutline,
} from "react-icons/io5";

export function ImageItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden bg-white border shadow-sm animate-in fade-in zoom-in-95 duration-200">
      {item.previewUrl ? (
        <img
          src={item.previewUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/50">
          <IoImageOutline className="h-6 w-6 text-muted-foreground/40" />
        </div>
      )}

      {item.status === "uploading" && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-2">
          <IoReloadOutline className="h-6 w-6 text-white animate-spin mb-2" />
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
          <IoCheckmarkCircleOutline className="h-3 w-3" />
        </div>
      )}

      {item.status === "error" && (
        <div className="absolute inset-0 bg-destructive/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-white animate-in zoom-in-95">
          <IoAlertCircleOutline className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Failed
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
