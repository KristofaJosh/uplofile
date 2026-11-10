import { usePostHog } from "@posthog/react";
import { useCallback, useEffect, useRef, useState } from "react";

type CopyContext = {
  kind: "install" | "snippet" | "import";
  label: string;
};

export const useCopy = (resetMs = 1800) => {
  const posthog = usePostHog();
  const [copied, setCopied] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string, context?: CopyContext) => {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        return false;
      }

      const page = window.location.pathname;

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }

      setCopied(true);
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
      resetTimeout.current = setTimeout(() => setCopied(false), resetMs);
      if (context) {
        posthog?.capture("code_copied", { ...context, page });
      }
      return true;
    },
    [posthog, resetMs],
  );

  return [copied, copy] as const;
};
