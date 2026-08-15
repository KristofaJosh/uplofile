import { Root } from "uplofile";

export function Uploader({ children }: { children: React.ReactNode }) {
  return (
    <Root
      upload={async (file) => {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        if (!response.ok) throw new Error("Upload failed");
        return response.json(); // { url, id?, meta?, previewUrl? }
      }}
    >
      {children}
    </Root>
  );
}
