import { useEffect, useRef, useState } from "react";
import type { UplofileRootRef } from "uplofile";
import {
  UplofileRoot,
  UplofilePreview,
  UplofileTrigger,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { twMerge } from "tailwind-merge";

export default function LoadingStateImperativeDemo() {
  const rootRef = useRef<UplofileRootRef>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Subscribe imperatively to hydration status
    if (!rootRef.current) return;
    rootRef.current.onLoadingChange = (loading) => {
      setReady(!loading);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <div
          className={`h-2 w-2 rounded-full ${ready ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
        />
        <span>{ready ? "Hydrated • ready" : "Hydrating initial files…"}</span>
      </div>

      <UplofileRoot
        ref={rootRef}
        upload={mockUpload}
        initial={loadInitial()}
        accept="image/*"
      >
        <UplofileTrigger
          render={({ open }) => (
            <button
              onClick={open}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow"
            >
              Add more
            </button>
          )}
        />
        <div className={"grid mt-6 gap-3 items-center  grid-cols-3"}>
          <UplofilePreview className="!block" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={twMerge(
                "aspect-square rounded-lg bg-muted animate-pulse",
                ready && "hidden",
              )}
            />
          ))}
        </div>
      </UplofileRoot>
    </div>
  );
}

const loadInitial = () =>
  new Promise<Array<{ uid: string; name: string; url: string }>>((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            uid: "srv-2",
            name: "hydrated-from-server.jpg",
            url: "https://picsum.photos/id/1025/600/400",
          },
        ]),
      6000,
    );
  });
