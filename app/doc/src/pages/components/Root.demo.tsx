import { UplofileRoot } from "uplofile";

export default function RootDemo() {
  return (
    <UplofileRoot
      upload={async (file, signal, onProgress) => {
        // Implement your upload logic here
        // e.g., using fetch with FormData
        return { url: "https://example.com/image.jpg", id: "123" };
      }}
      removeMode="optimistic"
      onRemove={async (item, signal) => {
        // Optional: implement server-side removal
      }}
      onChange={(items) => {
        console.log("Files changed:", items);
      }}
    >
      {/* Child components */}
    </UplofileRoot>
  );
}
