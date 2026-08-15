import type { UploadFileItem } from "@/components/ui/uplofile";

export function BatchFileItem({ item }: { item: UploadFileItem }) {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <span className="text-xs text-muted-foreground">
          {item.status === "uploading" ? "Queued" : item.status}
        </span>
      </div>
    </div>
  );
}
