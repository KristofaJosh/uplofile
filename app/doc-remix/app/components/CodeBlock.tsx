import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { Highlight } from "prism-react-renderer";
import { useCopy } from "@/hooks/use-copy";

// Mirrors the compact token palette used in the reference docs: quiet prose,
// violet language keywords, cyan types/functions, and warm strings.
const docsCodeTheme = {
  plain: { color: "#aeb2c2", backgroundColor: "transparent" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#73798e" },
    },
    {
      types: ["keyword", "operator", "atrule", "attr-name"],
      style: { color: "#aca3e7" },
    },
    {
      types: ["string", "char", "attr-value", "template-string"],
      style: { color: "#d59a86" },
    },
    {
      types: ["function", "class-name", "builtin"],
      style: { color: "#a9ddff" },
    },
    {
      types: ["tag", "property", "constant", "symbol", "boolean", "number"],
      style: { color: "#8ec8eb" },
    },
    { types: ["punctuation"], style: { color: "#c6c9d5" } },
  ],
};

export const HighlightedPre = ({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) => (
  <Highlight theme={docsCodeTheme} code={code.trim()} language={language}>
    {({ className, tokens, getLineProps, getTokenProps }) => (
      <pre className={className}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock = ({
  code,
  language = "tsx",
  filename,
}: CodeBlockProps) => {
  const [copied, copy] = useCopy();
  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        <span>
          {filename ?? (language === "tsx" ? "example.tsx" : language)}
        </span>
        <button
          type="button"
          onClick={() => void copy(code.trim())}
          aria-label="Copy code"
        >
          {copied ? (
            <IoCheckmarkOutline aria-hidden="true" size={14} />
          ) : (
            <IoCopyOutline aria-hidden="true" size={14} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <HighlightedPre code={code} language={language} />
    </div>
  );
};
