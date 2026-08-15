import { Root } from "uplofile";

declare const upload: () => Promise<{ url: string }>;

// Strict mode keeps the card visible until the server confirms deletion.
<Root
  upload={upload}
  removeMode="strict"
  onRemove={async (item, signal) => {
    const response = await fetch(`/api/files/${item.id}`, {
      method: "DELETE",
      signal,
    });
    if (!response.ok) throw new Error("Delete failed");
  }}
/>;
