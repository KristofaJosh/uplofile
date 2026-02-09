import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./SortableGallery.demo.tsx";
import code from "./SortableGallery.demo.tsx?raw";

const ExampleSortableGallery = () => {
  return (
    <ExamplePage
      title="Sortable Image Gallery"
      description="An image gallery uploader that allows reordering completed items using drag and drop."
      code={code}
      keyPoints={[
        <>
          Integrated with <code className="code-inline">@dnd-kit</code> for
          smooth drag-and-drop
        </>,
        <>
          Only completed items (
          <code className="code-inline">status === 'done'</code>) are draggable
        </>,
        <>Drag handle appears on hover in the top-left corner</>,
        <>
          Reordering is preserved through the{" "}
          <code className="code-inline">setItems</code> callback
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleSortableGallery;
