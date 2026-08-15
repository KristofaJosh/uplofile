import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./pauseresumeresumable.demo.tsx";
import demoCode from "./pauseresumeresumable.demo.tsx?raw";
import toolbarCode from "./pauseresumeresumable.toolbar.demo.tsx?raw";
import fileRowCode from "./pauseresumeresumable.filerow.demo.tsx?raw";
import actionButtonsCode from "./pauseresumeresumable.actionbuttons.demo.tsx?raw";
import statusBadgeCode from "./pauseresumeresumable.statusbadge.demo.tsx?raw";
import checkpointCode from "./pauseresumeresumable.checkpoint.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/pause-resume", [
    { title: "Pause/Resume Example - Uplofile" },
    {
      name: "description",
      content:
        "Build pause and resume behavior with custom upload adapters and useUplofile.",
    },
  ]);
};

const ExamplePauseResumeResumable = () => {
  return (
    <ExamplePage
      title="Pause/Resume (Custom Resumable Adapter)"
      description="A custom pause and resume flow built with useUplofile and a resumable upload adapter."
      codeTabs={[
        { label: "Pause/resume demo", code: demoCode },
        { label: "Toolbar", code: toolbarCode },
        { label: "File row", code: fileRowCode },
        { label: "Action buttons", code: actionButtonsCode },
        { label: "Status badge", code: statusBadgeCode },
        { label: "Checkpoint helper", code: checkpointCode },
      ]}
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
