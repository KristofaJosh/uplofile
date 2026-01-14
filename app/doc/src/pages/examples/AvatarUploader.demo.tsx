import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UploadFileItem,
} from "@/components/ui/uplofile";
import { User, Camera, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { mockUpload, cn } from "@/lib/utils.ts";
import { UplofileRetry } from "@/components/ui/uplofile";

export default function AvatarUploaderDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <UplofileRoot upload={mockUpload} accept="image/*">
        <UplofilePreview
          render={({ items }) => <AvatarPreview items={items} />}
        />
      </UplofileRoot>
      <div className="text-center">
        <p className="text-sm font-medium">Profile Picture</p>
        <p className="text-xs text-muted-foreground text-balance">
          JPG, GIF or PNG. Max size of 800K
        </p>
      </div>
    </div>
  );
}

function AvatarPreview({ items }: { items: UploadFileItem[] }) {
  const item = items[0];

  return (
    <div className="relative group">
      <div className="relative">
        <UplofileTrigger>
          <div
            className={cn(
              "relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-background shadow-xl bg-muted flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]",
              item?.status === "error" &&
                "border-destructive/50 ring-4 ring-destructive/10",
            )}
          >
            {item?.previewUrl ? (
              <img
                src={item.previewUrl}
                alt="Avatar"
                className={cn(
                  "w-full h-full object-cover animate-in fade-in duration-500",
                  item.status === "error" && "opacity-40 grayscale",
                )}
              />
            ) : (
              <User className="w-16 h-16 text-muted-foreground/50" />
            )}

            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-white text-[10px] font-medium uppercase tracking-wider">
                Change Photo
              </span>
            </div>

            {item?.status === "uploading" && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                <span className="text-white text-xs font-bold">
                  {item.progress}%
                </span>
              </div>
            )}

            {item?.status === "error" && (
              <div className="absolute inset-0 bg-destructive/60 flex flex-col items-center justify-center backdrop-blur-[1px]">
                <AlertCircle className="w-8 h-8 text-white mb-1" />
                <span className="text-white text-[10px] font-bold uppercase">
                  Error
                </span>
              </div>
            )}
          </div>
        </UplofileTrigger>

        {item?.status === "done" && (
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg animate-in zoom-in">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}

        {item?.status === "error" && (
          <UplofileRetry uid={item.uid} asChild>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-destructive text-white rounded-full border-4 border-background flex items-center justify-center shadow-lg animate-in zoom-in hover:scale-110 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </button>
          </UplofileRetry>
        )}
      </div>
    </div>
  );
}
