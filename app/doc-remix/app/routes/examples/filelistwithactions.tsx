import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./filelistwithactions.demo.tsx";
import code from "./filelistwithactions.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/file-list", [
    { title: "File List Example - Uplofile" },
    { name: "description", content: "A file list with actions example." },
  ]);
};

const ExampleFileListWithActions = () => {
  return (
    <ExamplePage
      title="File List with Actions"
      description="A detailed file list with file info, progress indicators, and remove buttons."
      code={code}
      keyPoints={[
        <>
          Uses <code className="code-inline">UplofileRemove</code> component
          with <code className="code-inline">uid</code> prop
        </>,
        <>File type icons based on extension</>,
        <>Human-readable file sizes</>,
        <>Status shown inline (uploading %, done, error)</>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleFileListWithActions;
