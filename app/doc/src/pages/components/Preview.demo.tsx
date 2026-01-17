import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "uplofile";

export default function PreviewDemo() {
  return (
    <UplofileRoot upload={async () => ({ url: "" })}>
      <UplofileDropzone className="border p-4 rounded">
        <UplofileTrigger>Select files</UplofileTrigger>

        {/* Default Preview */}
        <UplofilePreview />

        {/* Custom Preview with Render Props */}
        <UplofilePreview
          render={({ items, actions }) => (
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li key={item.uid} className="flex items-center gap-2">
                  <span>
                    {item.name} - {item.status}
                  </span>
                  <button
                    onClick={() => actions.remove(item.uid)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        />
      </UplofileDropzone>
    </UplofileRoot>
  );
}
