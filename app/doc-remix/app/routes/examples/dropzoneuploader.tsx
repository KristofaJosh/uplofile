import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./dropzoneuploader.demo.tsx";
import demoCode from "./dropzoneuploader.demo.tsx?raw";
import dropTargetCode from "./dropzoneuploader.droptarget.demo.tsx?raw";
import fileItemCode from "./dropzoneuploader.fileitem.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/dropzone", [
    { title: "Dropzone Uploader Example - Uplofile" },
    { name: "description", content: "A drag-and-drop file uploader example." },
  ]);
};

const ExampleDropzoneUploader = () => {
  return (
    <ExamplePage
      title="Dropzone Uploader"
      description="A drag-and-drop zone with visual feedback when files are dragged over."
      codeTabs={[
        { label: "Dropzone uploader demo", code: demoCode },
        { label: "Drop target content", code: dropTargetCode },
        { label: "Dropzone file item", code: fileItemCode },
      ]}
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
