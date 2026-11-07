import { Platform } from "react-native";
import { getNativePickerAcceptTypes } from "../shared/utils";

/**
 * MIME → Apple UTI table, mirroring `@react-native-documents/picker`'s own
 * `src/fileTypes.ts` (plus `text/*` → `public.text`).
 */
const MIME_TO_UTI: Readonly<Record<string, string>> = Object.freeze({
  "*/*": "public.item",
  "image/*": "public.image",
  "video/*": "public.movie",
  "audio/*": "public.audio",
  "text/*": "public.text",
  "text/plain": "public.plain-text",
  "text/csv": "public.comma-separated-values-text",
  "text/comma-separated-values": "public.comma-separated-values-text",
  "application/pdf": "com.adobe.pdf",
  "application/json": "public.json",
  "application/zip": "public.zip-archive",
  "application/msword": "com.microsoft.word.doc",
  "application/vnd.ms-excel": "com.microsoft.excel.xls",
  "application/vnd.ms-powerpoint": "com.microsoft.powerpoint.ppt",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "org.openxmlformats.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "org.openxmlformats.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "org.openxmlformats.presentationml.presentation",
});

/**
 * Builds the `type` option for `@react-native-documents/picker`'s `pick()`.
 *
 * Android takes MIME types as-is. iOS takes Apple UTIs and silently drops
 * anything it can't parse — an all-dropped list greys out every file — so
 * MIME tokens are mapped to UTIs there. If any token has no known UTI, no
 * OS filter is applied (`undefined`); callers still post-filter with
 * `acceptsFile`, so `accept` stays enforced.
 */
export const getDocumentsPickerTypes = (
  accept: string | undefined,
): string[] | undefined => {
  const mimeTypes = getNativePickerAcceptTypes(accept);
  if (!mimeTypes || Platform.OS !== "ios") return mimeTypes;

  const utis: string[] = [];
  for (const mime of mimeTypes) {
    const uti = MIME_TO_UTI[mime];
    if (!uti) return undefined;
    if (!utis.includes(uti)) utis.push(uti);
  }
  return utis;
};
