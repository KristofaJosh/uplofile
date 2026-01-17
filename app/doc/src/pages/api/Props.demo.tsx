import { UploadFileItem } from "uplofile";

function FileInfo({ item }: { item: UploadFileItem }) {
  return (
    <div>
      <h3>{item.name}</h3>
      <p>Status: {item.status}</p>
      {item.status === "uploading" && <p>Progress: {item.progress}%</p>}
      {item.status === "error" && <p className="error">Error: {item.error}</p>}
      {item.previewUrl && <img src={item.previewUrl} alt="Preview" />}
    </div>
  );
}
