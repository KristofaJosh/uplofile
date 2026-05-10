import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./dropzoneuploader.demo.tsx";
import code from "./dropzoneuploader.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Dropzone Uploader Example - Uplofile" },
    { name: "description", content: "A drag-and-drop file uploader example." },
  ];
};

const ExampleDropzoneUploader = () => {
  return (
    <ExamplePage
      title="Dropzone Uploader"
      description="A drag-and-drop zone with visual feedback when files are dragged over."
      code={code}
      keyPoints={[
        <>
          Uses <code className="code-inline">data-[dragging=true]</code> for
          visual feedback on drag
        </>,
        <>Combines dropzone with clickable trigger</>,
        <>
          <code className="code-inline">multiple</code> prop enables multi-file
          selection
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleDropzoneUploader;
