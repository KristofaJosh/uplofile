import { UplofileDropzone, UplofileTrigger } from "@/components/ui/uplofile";
import { IoAddOutline } from "react-icons/io5";

export function AddImageTile() {
  return (
    <UplofileDropzone className="group aspect-square rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/10 data-[dragging=true]:scale-95">
      <UplofileTrigger>
        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <IoAddOutline className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Add Image
          </span>
        </div>
      </UplofileTrigger>
    </UplofileDropzone>
  );
}
