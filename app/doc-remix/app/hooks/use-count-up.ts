import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Counts up from 0 to `target` whenever `target` changes, easing out. */
export const useCountUp = (target: number | null, durationMs = 2400) => {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (target === null) return;

    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, durationMs]);

  return value;
};
