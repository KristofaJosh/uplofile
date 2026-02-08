import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./RootImperative.demo.tsx";
import code from "./RootImperative.demo.tsx?raw";

const ExampleRootImperative = () => {
  return (
    <ExamplePage
      title="Imperative Root Control"
      description="Turn any parent element into a dropzone using a ref to the UplofileRoot component."
      code={code}
      keyPoints={[
        <>
          Use <code className="code-inline">ref</code> to access{" "}
          <code className="code-inline">UplofileRoot</code> methods
        </>,
        <>
          Implement custom drag and drop logic on parent containers using{" "}
          <code className="code-inline">onDragOver</code> and{" "}
          <code className="code-inline">onDrop</code>
        </>,
        <>
          Trigger the file dialog programmatically with{" "}
          <code className="code-inline">openFileDialog()</code>
        </>,
        <>
          Perfect for cases where the drop target is larger than the uploader
          itself
        </>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleRootImperative;
