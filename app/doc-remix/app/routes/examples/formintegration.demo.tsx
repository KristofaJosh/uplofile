import { IoSendOutline } from "react-icons/io5";
import { AttachmentsField } from "./formintegration.attachmentsfield.demo.tsx";

export default function FormIntegrationDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Form submitted:", Object.fromEntries(formData));
    alert("Form submitted! Check console for data.");
  };

  return (
    <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">
          Title
        </label>
        <input
          type="text"
          name="title"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
          placeholder="e.g. Project Proposal Q1"
          required
        />
      </div>

      <AttachmentsField />

      <div className="pt-4 border-t">
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-11 px-8 shadow-lg active:scale-[0.98]"
        >
          <IoSendOutline className="h-4 w-4" />
          Submit Application
        </button>
      </div>
    </form>
  );
}
