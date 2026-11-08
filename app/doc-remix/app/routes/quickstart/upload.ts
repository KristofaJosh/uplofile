export async function upload(file: File, signal: AbortSignal) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    signal,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json() as Promise<{ url: string; id?: string }>;
}
