import { describe, expect, it } from "vitest";

import { acceptsFile, isVideoFile } from "../shared/utils";
import type { RootProps, UploadFileItem, UplofileRootRef } from "../shared/types";
import type {
  NativeFile,
  RootProps as NativeRootProps,
  UplofileRootRef as NativeUplofileRootRef,
} from "./types";

/**
 * Compile-time + runtime checks that the native types default to
 * `NativeFile` and that every supported picker's result fits it, with no
 * `any`/`File` leaking through. No react-native render dependency, so it
 * runs under the existing vitest setup.
 */
describe("native public type compatibility", () => {
  it("accepts a NativeFile as the upload() file source", () => {
    const uploadArgs: { file: NativeFile }[] = [];

    const props: RootProps<{ tag: string }, NativeFile> = {
      upload: async (file, _signal, _setProgress) => {
        uploadArgs.push({ file });
        return { url: file.uri, meta: { tag: "ok" } };
      },
    };

    expect(typeof props.upload).toBe("function");
  });

  it("defaults native RootProps' file source to NativeFile and requires pickFiles", () => {
    const props: NativeRootProps = {
      upload: async (file) => ({ url: file.uri }),
      pickFiles: async () => [{ uri: "file:///a.png", name: "a.png" }],
    };
    // @ts-expect-error pickFiles is required in v4
    const missingPickFiles: NativeRootProps = { upload: props.upload };

    expect(typeof props.pickFiles).toBe("function");
    expect(missingPickFiles.pickFiles).toBeUndefined();
  });

  it("accepts the document pickers' and expo-image-picker's results as a NativeFile", () => {
    // Field shapes from each package's published types.
    const reactNativeDocumentsPicker = {
      uri: "file:///doc.pdf",
      name: "doc.pdf" as string | null,
      type: "application/pdf" as string | null,
      nativeType: "application/pdf" as string | null,
      size: 100 as number | null,
      isVirtual: false as boolean | null,
      convertibleToMimeTypes: null,
      hasRequestedType: true,
      error: null as string | null,
    };
    const expoDocumentPicker = {
      uri: "file:///doc.pdf",
      name: "doc.pdf",
      mimeType: "application/pdf" as string | undefined,
      size: 100 as number | undefined,
      lastModified: 0,
    };
    const expoImagePicker = {
      uri: "file:///a.jpg",
      width: 1,
      height: 1,
      fileName: "a.jpg" as string | null | undefined,
      mimeType: "image/jpeg" as string | undefined,
      fileSize: 10 as number | undefined,
      type: "image" as "image" | "video" | "livePhoto" | "pairedVideo" | undefined,
    };
    // react-native-image-picker types `uri` as optional, so its asset is
    // not a NativeFile; adapterReactNativeImagePicker infers its own type.
    const reactNativeImagePicker = {
      uri: "file:///a.jpg" as string | undefined,
      fileName: "a.jpg" as string | undefined,
    };
    // @ts-expect-error uri may be undefined on react-native-image-picker assets
    const notNativeFile: NativeFile = reactNativeImagePicker;

    const files: NativeFile[] = [
      reactNativeDocumentsPicker,
      expoDocumentPicker,
      expoImagePicker,
    ];
    expect(files).toHaveLength(3);
    expect(notNativeFile.uri).toBe("file:///a.jpg");
  });

  it("types UplofileRootRef.getItems() as NativeFile items", () => {
    const item: UploadFileItem<any, NativeFile> = {
      uid: "1",
      name: "doc.pdf",
      status: "idle",
      file: { uri: "file:///doc.pdf", name: "doc.pdf" },
    };

    const ref: Pick<NativeUplofileRootRef, "getItems"> = {
      getItems: () => [item],
    };
    const sharedRef: Pick<UplofileRootRef<any, NativeFile>, "getItems"> = ref;

    expect(sharedRef.getItems()[0].file?.uri).toBe("file:///doc.pdf");
  });

  it("shared file-type helpers work against picker-shaped items without DOM File", () => {
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
