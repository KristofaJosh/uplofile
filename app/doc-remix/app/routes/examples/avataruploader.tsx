import type { MetaFunction } from "react-router";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./avataruploader.demo.tsx";
import code from "./avataruploader.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return [
    { title: "Avatar Uploader Example - Uplofile" },
    {
      name: "description",
      content: "An avatar upload example with image cropping.",
    },
  ];
};

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
