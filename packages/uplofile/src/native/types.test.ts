import { describe, expect, it } from "vitest";
import type { DocumentPickerResponse } from "@react-native-documents/picker";

import { acceptsFile, isVideoFile } from "../shared/utils";
import type { RootProps, UploadFileItem, UplofileRootRef } from "../shared/types";
import type { UplofileRootRef as NativeUplofileRootRef } from "./types";

/**
 * Compile-time + runtime check that the shared, platform-neutral types
 * (previously defaulting the file-source generic to DOM `File`) are
 * actually compatible with the RN `DocumentPickerResponse` shape, with
 * no `any`/`File` leaking through. This file has no react-native render
 * dependency, so it runs under the existing vitest setup.
 */
describe("native public type compatibility", () => {
  it("accepts a DocumentPickerResponse as the upload() file source", () => {
    const uploadArgs: { file: DocumentPickerResponse }[] = [];

    const props: RootProps<{ tag: string }, DocumentPickerResponse> = {
      upload: async (file, _signal, _setProgress) => {
        uploadArgs.push({ file });
        return { url: file.uri, meta: { tag: "ok" } };
      },
    };

    expect(typeof props.upload).toBe("function");
  });

  it("types UplofileRootRef.getItems() as DocumentPickerResponse items", () => {
    const pickerResponse: DocumentPickerResponse = {
      uri: "file:///doc.pdf",
      name: "doc.pdf",
      type: "application/pdf",
      nativeType: "application/pdf",
      size: 100,
      isVirtual: false,
      convertibleToMimeTypes: null,
      hasRequestedType: true,
      error: null,
    };

    const item: UploadFileItem<any, DocumentPickerResponse> = {
      uid: "1",
      name: "doc.pdf",
      status: "idle",
      file: pickerResponse,
    };

    const ref: Pick<UplofileRootRef<any, DocumentPickerResponse>, "getItems"> = {
      getItems: () => [item],
    };

    expect(ref.getItems()[0].file?.uri).toBe("file:///doc.pdf");
  });

  it("shared file-type helpers work against DocumentPickerResponse-shaped items without DOM File", () => {
    const item: UploadFileItem<any, { type: string | null }> = {
      uid: "1",
      name: "movie.mov",
      status: "done",
      file: { type: "video/quicktime" },
    };

    expect(isVideoFile(item)).toBe(true);
    expect(
      acceptsFile({ name: "movie.mov", type: "video/quicktime" }, "video/*"),
    ).toBe(true);
  });

  it("omits the web-only onDrop/onDragOver (DOM DragEvent) members from the native ref type", () => {
    // Compile-time guard: if either key were still present on the native
    // ref type, this conditional would resolve to `true` and fail to
    // assign into a `false`-typed const.
    type HasDragHandlers = "onDrop" extends keyof NativeUplofileRootRef
      ? true
      : "onDragOver" extends keyof NativeUplofileRootRef
        ? true
        : false;
    const hasDragHandlers: HasDragHandlers = false;

    expect(hasDragHandlers).toBe(false);
  });
});
