import { Root } from "uplofile";

declare const presignedUrl: string;

// The third argument reports 0–100 back to Preview.
<Root
  upload={(file, signal, setProgress) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) =>
        setProgress?.(Math.round((event.loaded / event.total) * 100));

      signal.addEventListener("abort", () => xhr.abort());
      xhr.onload = () => resolve(JSON.parse(xhr.responseText));
      xhr.onerror = reject;
      xhr.open("PUT", presignedUrl);
      xhr.send(file);
    })
  }
/>;
