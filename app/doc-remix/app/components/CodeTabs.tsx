import { useId, useState } from "react";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { HighlightedPre } from "./CodeBlock";
import { useCopy } from "@/hooks/use-copy";

export type CodeTab = { label: string; code: string };

export const CodeTabs = ({
  tabs,
  language = "tsx",
}: {
  tabs: CodeTab[];
  language?: string;
}) => {
  const [active, setActive] = useState(0);
  const [copied, copy] = useCopy();
  const tabListId = useId();
  const activeIndex = active < tabs.length ? active : 0;
  const selectedTab = tabs[activeIndex];

  const selectRelativeTab = (index: number) => {
    const nextIndex = (index + tabs.length) % tabs.length;
    setActive(nextIndex);
    document.getElementById(`${tabListId}-tab-${nextIndex}`)?.focus();
  };

  if (!selectedTab) {
    return null;
  }

  return (
    <div className="code-tabs">
      <div className="code-tabs__bar" role="tablist" aria-label="Code examples">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            id={`${tabListId}-tab-${i}`}
            role="tab"
            aria-controls={`${tabListId}-panel-${i}`}
            aria-selected={i === activeIndex}
            tabIndex={i === activeIndex ? 0 : -1}
            className={i === activeIndex ? "is-active" : ""}
            onClick={() => setActive(i)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                selectRelativeTab(i + 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                selectRelativeTab(i - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                setActive(0);
                document.getElementById(`${tabListId}-tab-0`)?.focus();
              } else if (event.key === "End") {
                event.preventDefault();
                const lastIndex = tabs.length - 1;
                setActive(lastIndex);
                document
                  .getElementById(`${tabListId}-tab-${lastIndex}`)
                  ?.focus();
              }
            }}
          >
            {tab.label}
          </button>
        ))}
        <button
          type="button"
          className="code-tabs__copy"
          onClick={() => void copy(selectedTab.code.trim())}
          aria-label="Copy code"
        >
          {copied ? (
            <IoCheckmarkOutline aria-hidden="true" size={13} />
          ) : (
            <IoCopyOutline aria-hidden="true" size={13} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div
        id={`${tabListId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${tabListId}-tab-${activeIndex}`}
        tabIndex={0}
      >
        <HighlightedPre code={selectedTab.code} language={language} />
      </div>
    </div>
  );
};
