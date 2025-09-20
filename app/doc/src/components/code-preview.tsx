import { type ComponentType } from "react";

export default function CodePreview({
  component: PreviewComponent,
  ...props
}: {
  component?: ComponentType<any>;
}) {
  return (
    <div className={"border rounded"}>
      <PreviewComponent {...props} />
    </div>
  );
}
