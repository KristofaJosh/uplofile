import { UplofileRoot, UplofileHiddenInput } from "uplofile";

export default function HiddenInputDemo() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log("Form data:", formData.get("attachments"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <UplofileRoot upload={async () => ({ url: "" })}>
        {/* ... other components */}
        <UplofileHiddenInput name="attachments" />
      </UplofileRoot>
      <button type="submit">Submit</button>
    </form>
  );
}
