import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./basicuploader.demo.tsx";
import code from "./basicuploader.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Basic Uploader Example - Uplofile" },
    {
      name: "description",
      content: "A basic file uploader example using Uplofile components.",
    },
  ];
};

const ExampleBasicUploader = () => {
  return (
    <ExamplePage
      title="Basic File Uploader"
      description="A minimal file uploader with a button trigger and file preview list."
      code={code}
      keyPoints={[
        <>
          Uses <code className="code-inline">UplofileTrigger</code> with a
          custom button
        </>,
        <>
          Simple file list display with{" "}
          <code className="code-inline">UplofilePreview</code>
        </>,
        <>
          Requires an <code className="code-inline">upload</code> function that
          returns <code className="code-inline">{`{ url, id }`}</code>
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleBasicUploader;
