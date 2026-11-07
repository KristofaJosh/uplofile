import type { NativeFile } from "./types";

import { useUplofile as useUplofileShared } from "../shared/hook";

export const useUplofile = <
  TMeta = any,
  TFileSource = NativeFile,
>() => useUplofileShared<TMeta, TFileSource>();
