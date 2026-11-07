import {
  useUplofile as useUplofileShared,
  useUplofileSelector as useUplofileSelectorShared,
  useUplofileStable as useUplofileStableShared,
} from "../shared/hook";
import type { UploadFileItem } from "../shared/types";

export const useUplofile = <TMeta = any, TFileSource = File>() =>
  useUplofileShared<TMeta, TFileSource>();

// Internal, File-pinned wrappers (not exported from the package entry).
export const useUplofileStable = <TMeta = any>() =>
  useUplofileStableShared<TMeta, File>();

export const useUplofileSelector = <T, TMeta = any>(
  selector: (items: UploadFileItem<TMeta, File>[]) => T,
  isEqual?: (a: T, b: T) => boolean,
) => useUplofileSelectorShared<T, TMeta, File>(selector, isEqual);
