import { useContext, useMemo, useRef, useSyncExternalStore } from "react";

import { computeHiddenInputValue, UploaderCtx } from "./context";
import type { ImageUploaderContextValue, UploadFileItem } from "./types";

function useStableCtx<TMeta = any, TFileSource = unknown>() {
  const ctx = useContext(UploaderCtx);
  if (!ctx) throw new Error("useUplofile must be used within <Uplofile.Root>");
  return ctx as typeof ctx & {
    store: {
      getSnapshot: () => UploadFileItem<TMeta, TFileSource>[];
      subscribe: (listener: () => void) => () => void;
    };
  };
}

// Public hook — unchanged return shape. Merges the stable context slice with
// a full items subscription, so callers keep getting a fresh `items` array
// (and everything derived from it) on every tick exactly as before.
export const useUplofile = <TMeta = any, TFileSource = unknown>() => {
  const ctx = useStableCtx<TMeta, TFileSource>();
  const items = useSyncExternalStore(
    ctx.store.subscribe,
    ctx.store.getSnapshot,
  );
  const hiddenInputValue = useMemo(
    () => computeHiddenInputValue(items),
    [items],
  );

  return {
    ...ctx,
    items,
    hiddenInputValue,
  } as ImageUploaderContextValue<TMeta, TFileSource>;
};

// Internal only — the stable context slice with no items subscription at
// all, for consumers (e.g. Dropzone) that never read items/progress. Its
// identity only changes when disabled/multiple/accept/actions actually
// change, never on a progress tick.
export const useUplofileStable = <TMeta = any, TFileSource = unknown>() =>
  useStableCtx<TMeta, TFileSource>();

// Internal only — subscribe to a derived slice of items. `isEqual` decides
// whether the previous selected value is reused (skipping the re-render) or
// the new one is committed. Mirrors the "memoize the snapshot" pattern React
// documents for useSyncExternalStore when a selector needs value-equality
// instead of the hook's default reference (Object.is) check.
export function useUplofileSelector<T, TMeta = any, TFileSource = unknown>(
  selector: (items: UploadFileItem<TMeta, TFileSource>[]) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T {
  const ctx = useStableCtx<TMeta, TFileSource>();
  const cacheRef = useRef<{ has: boolean; value: T }>({
    has: false,
    value: undefined as unknown as T,
  });

  const getSnapshot = () => {
    const next = selector(ctx.store.getSnapshot());
    if (cacheRef.current.has && isEqual(cacheRef.current.value, next)) {
      return cacheRef.current.value;
    }
    cacheRef.current = { has: true, value: next };
    return next;
  };

  return useSyncExternalStore(ctx.store.subscribe, getSnapshot, getSnapshot);
}
