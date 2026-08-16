import type { MetaFunction } from "react-router";
import { withPageMeta } from "@/lib/seo";
import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./imagegallery.demo.tsx";
import demoCode from "./imagegallery.demo.tsx?raw";
import imageItemCode from "./imagegallery.imageitem.demo.tsx?raw";
import addTileCode from "./imagegallery.addtile.demo.tsx?raw";

export const meta: MetaFunction = () => {
  return withPageMeta("/examples/image-gallery", [
    { title: "Image Gallery Example - Uplofile" },
    {
      name: "description",
      content: "An image gallery upload example with previews.",
    },
  ]);
};

const ExampleImageGallery = () => {
  return (
    <ExamplePage
      title="Image Gallery Uploader"
      description="An image-focused uploader with thumbnail previews in a grid layout."
      codeTabs={[
        { label: "Image gallery demo", code: demoCode },
        { label: "Add image tile", code: addTileCode },
        { label: "Image item", code: imageItemCode },
      ]}
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
