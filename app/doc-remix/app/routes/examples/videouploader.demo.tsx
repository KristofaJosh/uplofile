import {
  UplofileRoot,
  UplofileTrigger,
  UplofileDropzone,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { IoVideocamOutline, IoCloudUploadOutline } from "react-icons/io5";
import { mockUpload } from "@/lib/utils.ts";
import { VideoItem } from "./videouploader.videoitem.demo.tsx";

export default function VideoUploaderDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>{`
        @keyframes progress-stripe {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}</style>
      <UplofileRoot
        upload={(file, signal, progress) =>
          mockUpload(file, signal, progress, 0.4)
        }
        multiple
        accept="video/*"
      >
        <div className="space-y-6">
          <UplofileDropzone asChild>
            <UplofileTrigger asChild>
              <div className="group relative flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-muted-foreground/25 rounded-3xl bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer overflow-hidden data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/10 data-[dragging=true]:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex flex-col items-center gap-4 text-center p-6 transition-transform duration-300 group-data-[dragging=true]:scale-110">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 rounded-2xl bg-background border shadow-sm text-primary group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                      <IoVideocamOutline className="h-8 w-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-primary text-primary-foreground shadow-sm scale-0 group-hover:scale-100 transition-transform delay-100">
                      <IoCloudUploadOutline className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold tracking-tight">
                      Click or drag video to upload
                    </p>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                      Support for MP4, WebM or OGG up to 100MB
                    </p>
                  </div>
                </div>
              </div>
            </UplofileTrigger>
          </UplofileDropzone>

          <UplofilePreview
            render={({ items }) => (
              <div className="grid gap-4">
                {items.map((item) => (
                  <VideoItem key={item.uid} item={item} />
                ))}
              </div>
            )}
          />
        </div>
      </UplofileRoot>
    </div>
  );
}
