import { useCallback } from "react";
import { useUplofile } from "uplofile";
import { UplofileDropzone, UplofileTrigger } from "@/components/ui/uplofile";
import { IoAddOutline } from "react-icons/io5";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableImageItem } from "./sortablegallery.sortableimageitem.demo.tsx";

export function SortableGalleryGrid() {
  const { items, setItems } = useUplofile();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.uid === active.id);
        const newIndex = prev.findIndex((item) => item.uid === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    },
    [setItems],
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.uid)}
          strategy={rectSortingStrategy}
        >
          {items.map((item) => (
            <SortableImageItem key={item.uid} item={item} />
          ))}
        </SortableContext>
      </DndContext>

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
    </div>
  );
}
