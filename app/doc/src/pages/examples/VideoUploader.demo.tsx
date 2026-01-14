import {
  UplofileRoot,
  UplofileTrigger,
  UplofileDropzone,
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
      <style>{`
        @keyframes progress-stripe {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}</style>
      <UplofileRoot
        upload={(file, signal, progress) => mockUpload(file, signal, progress, 0.4)}
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
                      <Video className="h-8 w-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-primary text-primary-foreground shadow-sm scale-0 group-hover:scale-100 transition-transform delay-100">
                      <Upload className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold tracking-tight">Click or drag video to upload</p>
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
                  <div
                    key={item.uid}
                    className="group relative flex flex-col sm:flex-row gap-5 p-4 border rounded-3xl bg-card hover:shadow-md transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                  >
                    {/* Video Thumbnail/Preview Area */}
                    <div className="relative w-full sm:w-48 aspect-video shrink-0 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border shadow-inner">
                      {item.status === "done" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : item.previewUrl ? (
                        <video
                          src={item.previewUrl}
                          className="w-full h-full object-cover opacity-40 blur-[1px]"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                          <Video className="h-10 w-10" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">No Preview</span>
                        </div>
                      )}
                      
                      {item.status === "uploading" && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                           <div className="relative h-12 w-12 flex items-center justify-center">
                              <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  className="text-muted/20"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  strokeDasharray={282.7}
                                  strokeDashoffset={282.7 - (282.7 * item.progress) / 100}
                                  className="text-primary transition-all duration-300 ease-out"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="text-[10px] font-bold tabular-nums">{item.progress}%</span>
                           </div>
                        </div>
                      )}

                      {item.status === "done" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="h-6 w-6 fill-current" />
                          </div>
                        </div>
                      )}

                      {item.status === "error" && (
                        <div className="absolute inset-0 bg-destructive/10 backdrop-blur-[1px] flex items-center justify-center">
                           <AlertCircle className="h-8 w-8 text-destructive/50" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="space-y-1 min-w-0">
                            <p className="text-sm font-bold truncate pr-2 text-foreground/90">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {item.file?.type.split('/')[1] || 'video'}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 font-medium">
                                {formatBytes(item.file?.size || 0)}
                              </span>
                            </div>
                          </div>
                          <UplofileRemove
                            uid={item.uid}
                            className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90"
                          >
                            <X className="h-4 w-4" />
                          </UplofileRemove>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {item.status === "uploading" && (
                          <div className="flex items-center justify-between gap-3">
                             <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-300 ease-out relative"
                                  style={{ width: `${item.progress}%` }}
                                >
                                   <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripe_1s_linear_infinite]" />
                                </div>
                             </div>
                             <UplofileCancel uid={item.uid} asChild>
                                <button className="p-1.5 rounded-lg bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground" title="Cancel upload">
                                    <Ban className="h-3.5 w-3.5" />
                                </button>
                             </UplofileCancel>
                          </div>
                        )}

                        {item.status === "error" && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-destructive">
                              <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Upload Failed</span>
                            </div>
                            <UplofileRetry uid={item.uid} asChild>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-all shadow-sm active:scale-95">
                                    <RotateCcw className="h-3 w-3" />
                                    Retry
                                </button>
                            </UplofileRetry>
                          </div>
                        )}

                        {item.status === "done" && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Ready to publish</span>
                            </div>
                            <button className="text-[10px] font-bold text-primary hover:underline transition-all">
                                Preview Video
                            </button>
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
