import { useContext, useRef } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";

import { computeHiddenInputValue, UploaderCtx } from "./context";
import type {
  ImageUploaderContextValue,
  StableUploaderCtxValue,
  UploadFileItem,
} from "./types";

// Internal: the stable context slice, with no items subscription. For
// consumers (e.g. Dropzone) that never read items, so they skip every tick.
export const useUplofileStable = <TMeta = any, TFileSource = unknown>() => {
  const ctx = useContext(UploaderCtx);
  if (!ctx) throw new Error("useUplofile must be used within <Uplofile.Root>");
  return ctx as StableUploaderCtxValue<TMeta, TFileSource>;
};

// Public hook, same return shape as before: the stable slice plus a full
// items subscription, so callers re-render on every items change.
export const useUplofile = <
  TMeta = any,
  TFileSource = unknown,
>(): ImageUploaderContextValue<TMeta, TFileSource> => {
  const { store, ...ctx } = useUplofileStable<TMeta, TFileSource>();
  const items = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  return {
    ...ctx,
    items,
    setItems: store.setItems,
    // Lazy, so only callers that read it pay for the JSON.stringify.
    get hiddenInputValue() {
      return computeHiddenInputValue(items);
    },
  };
};

// Internal: subscribe to a derived slice of items. `isEqual` decides whether
// the previous value is reused (skipping the re-render). This is the
// memoized-snapshot pattern React documents for useSyncExternalStore.
export function useUplofileSelector<T, TMeta = any, TFileSource = unknown>(
  selector: (items: UploadFileItem<TMeta, TFileSource>[]) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T {
  const { store } = useUplofileStable<TMeta, TFileSource>();
  const cacheRef = useRef<{ has: boolean; value: T }>({
    has: false,
    value: undefined as unknown as T,
  });

  const getSnapshot = () => {
    const next = selector(store.getSnapshot());
    if (cacheRef.current.has && isEqual(cacheRef.current.value, next)) {
      return cacheRef.current.value;
    }
    cacheRef.current = { has: true, value: next };
    return next;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
