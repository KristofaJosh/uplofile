/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";

vi.mock("react-native", () => ({
  View: ({ children }: any) => <div>{children}</div>,
  Platform: { OS: "android" },
}));

import { Root } from "./Root";
import { adapterReactNativeDocumentsPicker } from "./adapters";
import type { UplofileRootRef } from "./types";

// Shape of an @react-native-documents/picker result; uplofile no longer
// depends on that package, so the test declares it locally.
type DocumentPickerResult = {
  uri: string;
  name: string | null;
  type: string | null;
  size: number | null;
};

afterEach(cleanup);

const mockUpload = vi.fn().mockResolvedValue({ url: "https://example.com/f" });

describe("native Root — pickFiles prop", () => {
  it("calls pickFiles and adds the returned results", async () => {
    const customPickFiles = vi
      .fn()
      .mockResolvedValue([
        { uri: "custom://a", name: "a", type: "text/plain" },
      ]);
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        accept="text/plain"
        multiple
        pickFiles={customPickFiles}
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await ref!.openFileDialog();

    expect(customPickFiles).toHaveBeenCalledWith("text/plain", {
      multiple: true,
    });
    await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
    expect(ref!.getItems()[0].name).toBe("a");
  });

  it("passes a pickFiles rejection to onPickError and adds nothing", async () => {
    const error = new Error("permission denied");
    const customPickFiles = vi.fn().mockRejectedValue(error);
    const onPickError = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        pickFiles={customPickFiles}
        onPickError={onPickError}
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await expect(ref!.openFileDialog()).resolves.toBeUndefined();
    expect(onPickError).toHaveBeenCalledWith(error);
    expect(warn).not.toHaveBeenCalled();
    expect(ref!.getItems()).toHaveLength(0);
    warn.mockRestore();
  });

  it("warns when pickFiles rejects and no onPickError is given", async () => {
    const error = new Error("permission denied");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        pickFiles={vi.fn().mockRejectedValue(error)}
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await ref!.openFileDialog();
    expect(warn).toHaveBeenCalledWith("[uplofile] pickFiles failed:", error);
    warn.mockRestore();
  });

  it("does not add items when pickFiles resolves to an empty array", async () => {
    const customPickFiles = vi.fn().mockResolvedValue([]);
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        pickFiles={customPickFiles}
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await ref!.openFileDialog();

    expect(ref!.getItems()).toHaveLength(0);
  });

  it("wires end-to-end with the real adapterReactNativeDocumentsPicker + a mocked pick(), with TFileSource set to the picker result type", async () => {
    const pickMock = vi.fn().mockResolvedValueOnce([
      { uri: "file:///a.png", name: "a.png", type: "image/png" },
    ]);
    let ref: UplofileRootRef<any, DocumentPickerResult> | null = null;

    render(
      <Root<any, DocumentPickerResult>
        upload={async (file) => {
          // `file` is typed as DocumentPickerResult here, so .uri needs
          // no cast.
          return { url: file.uri };
        }}
        pickFiles={adapterReactNativeDocumentsPicker(pickMock)}
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await ref!.openFileDialog();

    expect(pickMock).toHaveBeenCalledWith({
      type: undefined,
      allowMultiSelection: true,
    });
    await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
    expect(ref!.getItems()[0].name).toBe("a.png");
  });
});
