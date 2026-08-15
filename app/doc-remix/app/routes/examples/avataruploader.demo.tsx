import { UplofileRoot, UplofilePreview } from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";
import { AvatarPreview } from "./avataruploader.avatarpreview.demo.tsx";

export default function AvatarUploaderDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <UplofileRoot upload={mockUpload} accept="image/*" multiple={false}>
        <UplofilePreview
          render={({ items }) => <AvatarPreview items={items} />}
        />
      </UplofileRoot>
      <div className="text-center">
        <p className="text-sm font-medium">Profile Picture</p>
        <p className="text-xs text-muted-foreground text-balance">
          JPG, GIF or PNG. Max size of 800K
        </p>
      </div>
    </div>
  );
}
