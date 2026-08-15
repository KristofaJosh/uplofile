import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./batchupload.demo.tsx";
import demoCode from "./batchupload.demo.tsx?raw";
import fileItemCode from "./batchupload.batchfileitem.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/batch-upload", [
    { title: "Batch Upload Example - Uplofile" },
    {
      name: "description",
      content:
        "A batch file uploader example that collects files and sends them as a single request.",
    },
  ]);
};

const ExampleBatchUpload = () => {
  return (
    <ExamplePage
      title="Batch Upload"
      description="Collect multiple files and upload them all at once in a single request."
      codeTabs={[
        { label: "Batch upload demo", code: demoCode },
        { label: "Batch file item", code: fileItemCode },
      ]}
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
