import { useRef } from "react";
import { Preview, Root, type UplofileRootRef } from "uplofile";

const upload = async (file: File) => ({ url: URL.createObjectURL(file) });

export function PageDropTarget() {
  const ref = useRef<UplofileRootRef>(null);

  return (
    <main
      onDrop={(event) => ref.current?.onDrop?.(event)}
      onDragOver={(event) => ref.current?.onDragOver?.(event)}
    >
      <Root ref={ref} upload={upload}>
        <Preview />
      </Root>
    </main>
  );
}
