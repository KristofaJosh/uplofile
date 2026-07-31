import type { DocumentPickerResponse } from "@react-native-documents/picker";

import { useUplofile as useUplofileShared } from "../shared/hook";

export const useUplofile = <
  TMeta = any,
  TFileSource = DocumentPickerResponse,
>() => useUplofileShared<TMeta, TFileSource>();
