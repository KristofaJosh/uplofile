import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./BasicUploader.demo.tsx";
import code from "./BasicUploader.demo.tsx?raw";

const ExampleBasicUploader = () => {
  return (
    <ExamplePage
      title="Basic File Uploader"
      description="A minimal file uploader with a button trigger and file preview list."
      code={code}
      keyPoints={[
        <>Uses <code className="code-inline">UplofileTrigger</code> with a custom button</>,
        <>Simple file list display with <code className="code-inline">UplofilePreview</code></>,
        <>Requires an <code className="code-inline">upload</code> function that returns <code className="code-inline">{`{ url, id }`}</code></>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleBasicUploader;
