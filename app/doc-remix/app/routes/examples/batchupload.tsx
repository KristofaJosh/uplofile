import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./batchupload.demo.tsx";
import code from "./batchupload.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Batch Upload Example - Uplofile" },
    {
      name: "description",
      content:
        "A batch file uploader example that collects files and sends them as a single request.",
    },
  ];
};

const ExampleBatchUpload = () => {
  return (
    <ExamplePage
      title="Batch Upload"
      description="Collect multiple files and upload them all at once in a single request."
      code={code}
      keyPoints={[
        <>
          The <code className="code-inline">upload</code> function defers
          resolution until a batch trigger resolves all pending promises.
        </>,
        <>
          A <strong>Upload All</strong> button drains the queue and sends all
          files as one batch.
        </>,
        <>
          <code className="code-inline">useUplofile</code> is not needed —
          pending state is tracked outside the library via a ref.
        </>,
        <>
          Abort handling works normally: cancelling a pending file removes it
          from the batch queue.
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleBatchUpload;
