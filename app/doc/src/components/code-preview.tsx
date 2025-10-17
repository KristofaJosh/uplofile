import { type ComponentType } from "react";

const exampleModules = import.meta.glob("../examples/*.tsx", { eager: true });

export default function CodePreview({
  componentKey,
  ...props
}: {
  componentKey: string;
}) {
  const loader = exampleModules[componentKey] as { default?: ComponentType<any> } | undefined;
  const PreviewComponent = loader?.default;

  if (!PreviewComponent) {
    return (<div className='p-4 border border-gray-200'>
      <p>Component not loaded</p>
    </div>)
  }

  return (
    <div className={"border p-4 border-gray-200 h-full min-h-64"}>
      <PreviewComponent client:only="react" key={componentKey} {...props} />
    </div>
  );
}
