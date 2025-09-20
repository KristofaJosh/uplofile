import { type ComponentType, useEffect, useState } from "react";

export default function CodePreview({
  component,
  ...props
}: {
  component?: ComponentType<any>;
}) {
  console.log(component);
  const [Component, setComponent] = useState<ComponentType<any>>();

  useEffect(() => {
    setComponent(component)
  }, [component]);

  return (
    <div className={"border rounded"}>
      <Component {...props} />
    </div>
  );
}
