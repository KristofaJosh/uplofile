import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./beforeuploadvalidation.demo.tsx";
import code from "./beforeuploadvalidation.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Validation Example - Uplofile" },
    { name: "description", content: "How to validate files before upload." },
  ];
};

const ExampleBeforeUploadValidation = () => {
  return (
    <ExamplePage
      title="Before Upload Validation"
      description="Validate or enrich files before they are added to the state and uploaded."
      code={code}
      keyPoints={[
        <>
          Use the <code className="code-inline">beforeUpload</code> prop on{" "}
          <code className="code-inline">UplofileRoot</code>
        </>,
        <>Supports asynchronous validation (e.g., checking image dimensions)</>,
        <>
          Return <code className="code-inline">false</code> to reject the entire
          batch
        </>,
        <>
          Return an array of objects to provide granular control and error
          reasons
        </>,
        <>
          Files rejected with a <code className="code-inline">reason</code> are
          added to state with "error" status
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleBeforeUploadValidation;
