import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./AvatarUploader.demo.tsx";
import code from "./AvatarUploader.demo.tsx?raw";

const ExampleAvatarUploader = () => {
  return (
    <ExamplePage
      title="Avatar Uploader"
      description="A circular avatar uploader with hover overlay for profile pictures."
      code={code}
      keyPoints={[
        <>
          Single file upload (no <code className="code-inline">multiple</code>{" "}
          prop)
        </>,
        <>Hover overlay for change action</>,
        <>
          Circular crop with <code className="code-inline">rounded-full</code>
        </>,
        <>
          Uses <code className="code-inline">item.previewUrl</code> for instant
          preview
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleAvatarUploader;
