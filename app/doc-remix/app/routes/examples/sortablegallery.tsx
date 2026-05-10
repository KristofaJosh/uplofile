import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import { ClientOnly } from "@/components/ClientOnly";
import Demo from "./sortablegallery.demo.tsx";
import code from "./sortablegallery.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Sortable Gallery Example - Uplofile" },
    {
      name: "description",
      content: "A sortable image gallery with drag-and-drop reordering.",
    },
  ];
};

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
      <ClientOnly>
        <Demo />
      </ClientOnly>
    </ExamplePage>
  );
};

export default ExampleSortableGallery;
