import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./VideoUploader.demo.tsx";
import code from "./VideoUploader.demo.tsx?raw";

const ExampleVideoUploader = () => {
  return (
    <ExamplePage
      title="Video Uploader"
      description="A video-specific uploader with progress tracking, cancelable uploads, and retry logic for failed transfers."
      code={code}
      keyPoints={[
        <>Uses <code className="code-inline">UplofileCancel</code> to abort ongoing uploads</>,
        <>Uses <code className="code-inline">UplofileRetry</code> to restart failed uploads</>,
        <>Video-specific previews using HTML5 <code className="code-inline">&lt;video&gt;</code> tags</>,
        <>Custom status indicators for different upload states</>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleVideoUploader;
