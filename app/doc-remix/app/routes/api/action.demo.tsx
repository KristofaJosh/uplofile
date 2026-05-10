import { useUplofile } from "uplofile";

function CustomControls() {
  const {
    actions: { cancel, remove, retry },
    items,
    openFileDialog,
  } = useUplofile();

  return (
    <div>
      <button onClick={openFileDialog}>Open File</button>
      <div>
        {items.map((item) => {
          return (
            <div>
              <div>{item.name}</div>
              <button onClick={() => remove(item.uid)}>Remove</button>
              {item.status === "uploading" && (
                <button onClick={() => cancel(item.uid)}>Cancel</button>
              )}
              {item.status === "error" && (
                <button onClick={() => retry(item.uid)}>Retry</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
