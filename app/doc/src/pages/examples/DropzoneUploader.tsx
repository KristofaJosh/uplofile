import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./DropzoneUploader.demo.tsx";
import code from "./DropzoneUploader.demo.tsx?raw";

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
