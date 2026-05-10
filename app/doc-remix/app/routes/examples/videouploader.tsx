import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./videouploader.demo.tsx";
import code from "./videouploader.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Video Uploader Example - Uplofile" },
    { name: "description", content: "A video upload example with preview." },
  ];
};

const ExampleVideoUploader = () => {
  return (
    <ExamplePage
      title="Video Uploader"
      description="A video-specific uploader with progress tracking, cancelable uploads, and retry logic for failed transfers."
      code={code}
      keyPoints={[
        <>
          Uses <code className="code-inline">UplofileCancel</code> to abort
          ongoing uploads
        </>,
        <>
          Uses <code className="code-inline">UplofileRetry</code> to restart
          failed uploads
        </>,
        <>
          Video-specific previews using HTML5{" "}
          <code className="code-inline">&lt;video&gt;</code> tags
        </>,
        <>Custom status indicators for different upload states</>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleVideoUploader;
