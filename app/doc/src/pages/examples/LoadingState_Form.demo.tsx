import {
  UplofileRoot,
  UplofileHiddenInput,
  UplofilePreview,
  UplofileTrigger,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { Send, Loader2 } from "lucide-react";

export default function LoadingStateFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    alert("Submitted! Check console for payload.");
    console.log(Object.fromEntries(fd));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <UplofileRoot
        upload={mockUpload}
        initial={loadInitial()}
        name="attachments"
      >
        <UplofileHiddenInput />

        <UplofileTrigger
          render={({ isLoading, open }) => (
            <button
              type="button"
              onClick={open}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing…
                </span>
              ) : (
                "Add attachments"
              )}
            </button>
          )}
        />

        <UplofilePreview
          render={({ items, isLoading }) => (
            <div className="mt-4 space-y-2">
              {isLoading && (
                <p className="text-xs text-muted-foreground">
                  Hydrating initial attachments…
                </p>
              )}
              {items.map((it) => (
                <div key={it.uid} className="text-sm text-muted-foreground">
                  • {it.name}
                </div>
              ))}
            </div>
          )}
        />

        <div className="pt-2 border-t mt-4">
          <UplofileTrigger
            render={({ isLoading }) => (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-11 px-8 shadow-lg"
              >
                <Send className="h-4 w-4" />
                {isLoading ? "Please wait…" : "Submit"}
              </button>
            )}
          />
        </div>
      </UplofileRoot>
    </form>
  );
}

const loadInitial = () =>
  new Promise<Array<{ uid: string; name: string; url: string }>>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            uid: "srv-3",
            name: "doc-from-server.pdf",
            url: "https://example.com/doc-from-server.pdf",
          },
        ]),
      6000,
    );
  });
