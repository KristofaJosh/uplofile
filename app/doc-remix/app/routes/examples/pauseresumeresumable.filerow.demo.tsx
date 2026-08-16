import { UplofileRemove, type UploadFileItem } from "@/components/ui/uplofile";
import { IoTrashOutline } from "react-icons/io5";
import { StatusBadge } from "./pauseresumeresumable.statusbadge.demo.tsx";
import { ActionButtons } from "./pauseresumeresumable.actionbuttons.demo.tsx";

export function FileRow({ item }: { item: UploadFileItem }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <StatusBadge item={item} />
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${item.progress ?? 0}%` }}
          />
        </div>
      </div>

      <ActionButtons item={item} />

      <UplofileRemove
        uid={item.uid}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        <IoTrashOutline className="h-4 w-4" />
      </UplofileRemove>
    </div>
  );
}
