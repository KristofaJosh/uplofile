import { Root } from "uplofile";

declare const upload: () => Promise<{ url: string }>;

// Editing an existing record: files already on your server.
<Root
  upload={upload}
  initial={[
    { uid: "1", id: "f_882", name: "cover.jpg", url: "/u/cover.jpg" },
    { uid: "2", id: "f_883", name: "spec.pdf", url: "/u/spec.pdf" },
  ]}
/>;

// initial also accepts a Promise that resolves into the list.
