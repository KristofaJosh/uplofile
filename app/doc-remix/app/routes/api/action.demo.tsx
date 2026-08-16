import { useUplofile } from "uplofile";

function CustomControls() {
  const { items, actions, openFileDialog } = useUplofile();

  return (
    <div>
      <button onClick={openFileDialog}>Select files</button>
      {items.map((item) => (
        <div key={item.uid}>
          {item.name}
          {item.status === "uploading" && (
            <button onClick={() => actions.cancel(item.uid)}>Cancel</button>
          )}
          {item.status === "error" && (
            <button onClick={() => actions.retry(item.uid)}>Retry</button>
          )}
          <button onClick={() => actions.remove(item.uid)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
