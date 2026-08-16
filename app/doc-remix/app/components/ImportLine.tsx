import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { useCopy } from "@/hooks/use-copy";

export const ImportLine = ({
  names,
  from = "uplofile",
}: {
  names: string;
  from?: string;
}) => {
  const [copied, copy] = useCopy();
  const text = `import { ${names} } from "${from}";`;
  return (
    <div className="install-command import-line">
      <code>{text}</code>
      <button
        type="button"
        onClick={() => void copy(text)}
        aria-label="Copy import"
      >
        {copied ? (
          <IoCheckmarkOutline aria-hidden="true" size={14} />
        ) : (
          <IoCopyOutline aria-hidden="true" size={14} />
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Import copied" : ""}
      </span>
    </div>
  );
};
