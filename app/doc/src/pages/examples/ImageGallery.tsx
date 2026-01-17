import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./ImageGallery.demo.tsx";
import code from "./ImageGallery.demo.tsx?raw";

const ExampleImageGallery = () => {
  return (
    <ExamplePage
      title="Image Gallery Uploader"
      description="An image-focused uploader with thumbnail previews in a grid layout."
      code={code}
      keyPoints={[
        <>
          Uses <code className="code-inline">accept="image/*"</code> to filter
          file types
        </>,
        <>
          Grid layout with thumbnail previews via{" "}
          <code className="code-inline">item.previewUrl</code>
        </>,
        <>Add button appears alongside existing images</>,
        <>Progress overlay during upload</>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleImageGallery;
