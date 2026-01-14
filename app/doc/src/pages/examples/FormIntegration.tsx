import { ExamplePage } from "@/components/ExamplePage";
import Demo from "./FormIntegration.demo.tsx";
import code from "./FormIntegration.demo.tsx?raw";

const ExampleFormIntegration = () => {
  return (
    <ExamplePage
      title="Form Integration"
      description="Integrate uplofile into standard HTML forms with hidden input for form submission."
      code={code}
      keyPoints={[
        <>Uses <code className="code-inline">UplofileHiddenInput</code> for form compatibility</>,
        <>Set <code className="code-inline">name</code> prop on Root for the form field name</>,
        <>Uploaded file URLs accessible as JSON in FormData</>,
        <>Works with standard form handling and validation</>,
      ]}
    >
      <Demo />
    </ExamplePage>
  );
};

export default ExampleFormIntegration;
