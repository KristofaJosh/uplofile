import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./PauseResumeResumable.demo.tsx";
import code from "./PauseResumeResumable.demo.tsx?raw";

const ExamplePauseResumeResumable = () => {
  return (
    <ExamplePage
      title="Pause/Resume (Custom Resumable Adapter)"
      description="A custom pause and resume flow built with useUplofile and a resumable upload adapter."
      code={code}
      keyPoints={[
        <>
          Uses <code className="code-inline">useUplofile</code> for custom
          controls instead of adding package-level actions
        </>,
        <>
          Maps pause to <code className="code-inline">actions.cancel</code> and
          resume to <code className="code-inline">actions.retry</code>
        </>,
        <>
          Resumable behavior comes from the upload adapter (this demo stores
          checkpoints per file fingerprint)
        </>,
        <>
          For production, replace the adapter with a resumable client like
          <code className="code-inline">tus-js-client</code>
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExamplePauseResumeResumable;
