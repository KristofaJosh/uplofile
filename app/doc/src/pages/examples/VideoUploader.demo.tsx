import { useState } from "react";
import { clsx } from "clsx";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
  UplofileRemove,
  UplofileCancel,
  UplofileRetry,
} from "@/components/ui/uplofile";
import {
  Video,
  X,
  RotateCcw,
  Ban,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
} from "lucide-react";
import { formatBytes, mockUpload } from "@/lib/utils.ts";

export default function VideoUploaderDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <UplofileRoot
        upload={(file, signal, progress) => mockUpload(file, signal, progress, 0.4)}
        multiple
        accept="video/*"
      >
        <div className="space-y-6">
          <UplofileTrigger>
            <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-2xl bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Click to upload video</p>
                  <p className="text-xs text-muted-foreground">MP4, WebM or OGG (max. 100MB)</p>
                </div>
              </div>
            </div>
          </UplofileTrigger>

          <UplofilePreview
            render={({ items }) => (
              <div className="grid gap-4">
                {items.map((item) => (
                  <div
                    key={item.uid}
                    className="relative flex flex-col sm:flex-row gap-4 p-4 border rounded-2xl bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2"
                  >
                    {/* Video Thumbnail/Preview Area */}
                    <div className="relative w-full sm:w-40 h-24 shrink-0 rounded-lg bg-black/5 flex items-center justify-center overflow-hidden border">
                      {item.status === "done" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                      ) : item.previewUrl ? (
                        <video
                          src={item.previewUrl}
                          className="w-full h-full object-cover opacity-50"
                        />
                      ) : (
                        <Video className="h-8 w-8 text-muted-foreground/40" />
                      )}
                      
                      {item.status === "done" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="h-8 w-8 text-white fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-bold truncate pr-4">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1">
                             <UplofileRemove
                                uid={item.uid}
                                className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </UplofileRemove>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {formatBytes(item.file?.size || 0)} • {item.file?.type.split('/')[1] || 'video'}
                        </p>
                      </div>

                      <div className="mt-4">
                        {item.status === "uploading" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-primary animate-pulse">UPLOADING...</span>
                              <span className="tabular-nums">{item.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-end mt-2">
                                <UplofileCancel uid={item.uid} asChild>
                                    <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-muted hover:bg-muted-foreground/10 text-muted-foreground rounded-full transition-colors">
                                        <Ban className="h-3 w-3" />
                                        Cancel
                                    </button>
                                </UplofileCancel>
                            </div>
                          </div>
                        )}

                        {item.status === "error" && (
                          <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">Upload Failed</span>
                            </div>
                            <UplofileRetry uid={item.uid} asChild>
                                <button className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-sm">
                                    <RotateCcw className="h-3 w-3" />
                                    Retry
                                </button>
                            </UplofileRetry>
                          </div>
                        )}

                        {item.status === "done" && (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Ready to publish</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </UplofileRoot>
    </div>
  );
}
