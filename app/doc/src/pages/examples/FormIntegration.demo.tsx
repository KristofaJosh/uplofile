import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
  UplofileHiddenInput,
} from "@/components/ui/uplofile";
import { FileUp, Send, CheckCircle2, Loader2, Paperclip, AlertCircle } from "lucide-react";
import { mockUpload } from "@/lib/utils.ts";

export default function FormIntegrationDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Form submitted:", Object.fromEntries(formData));
    alert("Form submitted! Check console for data.");
  };

  return (
    <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">Title</label>
        <input
          type="text"
          name="title"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
          placeholder="e.g. Project Proposal Q1"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-tight flex items-center gap-2">
           <Paperclip className="h-3 w-3" />
           Attachments
        </label>
        <UplofileRoot upload={mockUpload} multiple name="attachments">
          <UplofileHiddenInput />
          
          <UplofileDropzone className="group relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/10">
            <UplofileTrigger>
              <div className="flex flex-col items-center gap-3 cursor-pointer">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <FileUp className="h-6 w-6" />
                </div>
                <div className="grid gap-0.5">
                   <span className="text-sm font-semibold text-gray-900">
                     Click to upload or drag and drop
                   </span>
                   <span className="text-xs text-muted-foreground">
                     PDF, PNG, JPG up to 10MB
                   </span>
                </div>
              </div>
            </UplofileTrigger>
          </UplofileDropzone>

          <UplofilePreview
            render={({ items }) => (
              <div className="mt-4 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.uid}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-1.5 rounded-md ${item.status === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                        {item.status === 'error' ? <AlertCircle className="h-3 w-3" /> : <Paperclip className="h-3 w-3" />}
                      </div>
                      <span className={`text-xs font-medium truncate max-w-[200px] ${item.status === 'error' ? 'text-destructive' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "uploading" && (
                        <>
                          <span className="text-[10px] font-bold text-muted-foreground">{item.progress}%</span>
                          <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        </>
                      )}
                      {item.status === "done" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                      {item.status === "error" && (
                        <span className="text-[10px] font-bold text-destructive uppercase">Failed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </UplofileRoot>
      </div>
      
      <div className="pt-4 border-t">
        <button 
          type="submit" 
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-11 px-8 shadow-lg active:scale-[0.98]"
        >
          <Send className="h-4 w-4" />
          Submit Application
        </button>
      </div>
    </form>
  );
}
