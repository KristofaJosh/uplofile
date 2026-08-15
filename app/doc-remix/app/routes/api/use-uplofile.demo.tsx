import { useUplofile } from "uplofile";

export function UploadSummary() {
  const { items, isLoading, accept, multiple } = useUplofile();
  const done = items.filter((item) => item.status === "done").length;

  if (isLoading) return <p>Loading existing files…</p>;

  return (
    <p>
      {done} of {items.length} uploaded · accepts {accept}
      {multiple ? " · multiple" : ""}
    </p>
  );
}
