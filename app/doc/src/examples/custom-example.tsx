import {
  UplofileRoot,
  UplofilePreview,
  UplofileTrigger,
  UplofileRetry,
  UplofileCancel,
  UplofileRemove,
} from "@/components/ui/uplofile.ts";
import { onRemove, upload } from "@/utils/upload-simulator.ts";

export default function BasicExample() {
  return (
    <UplofileRoot onRemove={onRemove} upload={upload}>
      <div className={"grid grid-cols-[auto_1fr] items-center gap-4"}>
        <UplofileTrigger asChild className={"p-3 rounded-lg border"}>
          <button>Pick Files</button>
        </UplofileTrigger>
        <UplofilePreview
          render={({ items, actions }) => {
            return (
              <div className={"flex gap-2"}>
                {items.map((item) => {
                  return (
                    <div key={item.uid} className={"size-14 shadow relative"}>
                      {["error", "uploading"].includes(item.status) && (
                        <UplofileRetry
                          className={
                            "flex items-center justify-center absolute rounded w-full h-full z-10 inset-0 bg-black/60  text-white text-xs"
                          }
                          uid={item.uid}
                        >
                          {item.status === "error" ? (
                            "Retry"
                          ) : (
                            <span className={"animate-spin font-semibold"}>
                              O
                            </span>
                          )}
                        </UplofileRetry>
                      )}
                      <img
                        className={"object-cover rounded w-full h-full"}
                        src={item.url || item.previewUrl}
                        alt={item.name}
                        key={item.uid}
                      />
                      <UplofileCancel
                        className={[
                          "bg-white cursor-pointer border rounded-full size-4 m-1text-black text-xs absolute top-1 right-1",
                          item.status === "uploading" && "z-20",
                        ].filter(Boolean).join(" ")}
                        asChild
                        uid={item.uid}
                      >
                        <button>X</button>
                      </UplofileCancel>
                      <UplofileRemove
                        className={[
                          "cursor-pointer text-black text-xs",
                          item.status === "removing" && "opacity-50",
                          item.status === "error" && "text-red-600",
                          item.status === "uploading" && "hidden",
                        ].filter(Boolean).join(" ")}
                        uid={item.uid}
                      >
                        Remove
                      </UplofileRemove>
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
      </div>
    </UplofileRoot>
  );
}
