import { useCallback, useEffect, useRef, useState } from "react";

export const useCopy = (resetMs = 1800) => {
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
    async (text: string) => {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        return false;
      }

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
      return true;
    },
    [resetMs],
  );

  return [copied, copy] as const;
};
