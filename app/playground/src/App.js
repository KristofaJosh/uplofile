import "./App.css";
import {
  UplofileCancel,
  UplofilePreview,
  UplofileRemove,
  UplofileRetry,
  UplofileRoot,
  UplofileTrigger,
} from "./components/ui/uplofile";
import { clsx } from "clsx";
import BasicUpload from "./components/uplofile-examples/basic";
import {
  CardTypeUpload,
  ControlledFormExample,
  DropzoneShowcase,
  MaxCountAndAccept,
  ProductModeration,
  SpinnerAvatarUpload,
} from "./components/uplofile-examples";

const upload = async (file, signal, setProgress) => {
  return await new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(
      () => {
        const increment = Math.floor(Math.random() * 16) + 5; // 5 - 20
        progress += increment;
        setProgress(progress > 100 ? 100 : progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({ url: URL.createObjectURL(file) });
        }
      },
      Math.floor(Math.random() * 701) + 300,
    ); // 300 - 1000 ms
  });
};

const onRemove = async (item) => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => resolve("something went wrong"), 4000),
  );
};

function App() {
  return (
    <div className="p-10">
      <BasicUpload />
      <CardTypeUpload />
      <ControlledFormExample />
      <DropzoneShowcase />
      <MaxCountAndAccept />
      <ProductModeration />
      <SpinnerAvatarUpload />
      <div className={"mt-10"}>
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
                        <div
                          key={item.uid}
                          className={"size-14 shadow relative"}
                        >
                          {["error", "uploading"].includes(item.status) && (
                            <UplofileRetry
                              className={clsx(
                                "flex items-center justify-center",
                                "absolute rounded w-full h-full z-10 inset-0 bg-black/60  text-white text-xs",
                              )}
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
                            className={clsx(
                              "bg-white cursor-pointer border rounded-full size-4 m-1text-black text-xs absolute top-1 right-1",
                              item.status === "uploading" && "z-20",
                            )}
                            asChild
                            uid={item.uid}
                          >
                            <button>X</button>
                          </UplofileCancel>
                          <UplofileRemove
                            className={clsx(
                              "cursor-pointer text-black text-xs",
                              item.status === "removing" && "opacity-50",
                              item.status === "error" && "text-red-600",
                              item.status === "uploading" && "hidden",
                            )}
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
      </div>
    </div>
  );
}

export default App;
