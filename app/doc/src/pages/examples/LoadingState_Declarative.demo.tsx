import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

export default function LoadingStateDeclarativeDemo() {
  return (
    <UplofileRoot
      upload={mockUpload}
      initial={loadInitial()}
      accept="image/*"
      multiple
    >
      <UplofileTrigger
        render={({ isLoading, open }) => (
          <button
            onClick={open}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
          >
            {isLoading ? "Loading initial files…" : "Select Images"}
          </button>
        )}
      />

      <div className="mt-6">
        <UplofilePreview
          render={({ isLoading, items }) => {
            if (isLoading) {
              return (
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-muted animate-pulse"
                    />
                  ))}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-3 gap-3">
                {items.map((item) => (
                  <img
                    key={item.uid}
                    src={item.url || item.previewUrl}
                    alt={item.name}
                    className="aspect-square w-full h-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            );
          }}
        />
      </div>
    </UplofileRoot>
  );
}

// Simulate async initial files hydration from server
const loadInitial = () =>
  new Promise<Array<{ uid: string; name: string; url: string }>>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            uid: "srv-1",
            name: "server-image.jpg",
            url: "https://picsum.photos/id/237/600/400",
          },
        ]),
      3500,
    );
  });
