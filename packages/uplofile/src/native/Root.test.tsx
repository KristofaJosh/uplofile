/**
 * @vitest-environment jsdom
 */
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";

vi.mock("react-native", () => ({
  View: ({ children }: any) => <div>{children}</div>,
}));

const pickMock = vi.fn();
vi.mock("@react-native-documents/picker", () => ({
  pick: (...args: any[]) => pickMock(...args),
}));

import { Root } from "./Root";
import { adapterReactNativeDocumentsPicker } from "./adapters";
import type { DocumentPickerResponse } from "@react-native-documents/picker";
import type { UplofileRootRef } from "./types";

afterEach(() => {
  cleanup();
  pickMock.mockReset();
});

const mockUpload = vi.fn().mockResolvedValue({ url: "https://example.com/f" });

describe("native Root — pick() fallback (pickFiles omitted)", () => {
  it("calls pick() with the mapped accept/multiple options and adds accepted results", async () => {
    pickMock.mockResolvedValueOnce([
      { uri: "file:///a.png", name: "a.png", type: "image/png" },
    ]);
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        accept="image/*"
        multiple={false}
        suppressDeprecationWarnings
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await ref!.openFileDialog();

    expect(pickMock).toHaveBeenCalledWith({
      type: ["image/*"],
      allowMultiSelection: false,
    });
    await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
    expect(ref!.getItems()[0].name).toBe("a.png");
  });

  it("filters out results that don't match accept, same as before", async () => {
    pickMock.mockResolvedValueOnce([
      { uri: "file:///a.pdf", name: "a.pdf", type: "application/pdf" },
    ]);
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        accept="image/*"
        suppressDeprecationWarnings
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

  it("no-ops silently when pick() rejects (cancellation)", async () => {
    pickMock.mockRejectedValueOnce(
      Object.assign(new Error("cancelled"), { code: "OPERATION_CANCELED" }),
    );
    let ref: UplofileRootRef | null = null;

    render(
      <Root
        upload={mockUpload}
        suppressDeprecationWarnings
        ref={(r) => {
          ref = r;
        }}
      >
        <div />
      </Root>,
    );

    await expect(ref!.openFileDialog()).resolves.toBeUndefined();
    expect(ref!.getItems()).toHaveLength(0);
  });
});

describe("native Root — deprecation warning", () => {
  it("fires exactly once per instance, not per render, when pickFiles is omitted", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { rerender } = render(
      <Root upload={mockUpload} multiple>
        <div />
      </Root>,
    );
    rerender(
      <Root upload={mockUpload} multiple={false}>
        <div />
      </Root>,
    );
    rerender(
      <Root upload={mockUpload} multiple>
        <div />
      </Root>,
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("pickFiles");
    warnSpy.mockRestore();
  });

  it("survives React StrictMode's double effect invocation without double-warning", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <React.StrictMode>
        <Root upload={mockUpload}>
          <div />
        </Root>
      </React.StrictMode>,
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("warns separately for each mounted Root instance", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Root upload={mockUpload}>
        <div />
      </Root>,
    );
    render(
      <Root upload={mockUpload}>
        <div />
      </Root>,
    );

    expect(warnSpy).toHaveBeenCalledTimes(2);
    warnSpy.mockRestore();
  });

  it("is silenced by suppressDeprecationWarnings", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Root upload={mockUpload} suppressDeprecationWarnings>
        <div />
      </Root>,
    );

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("does not fire when pickFiles is provided", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Root upload={mockUpload} pickFiles={async () => []}>
        <div />
      </Root>,
    );

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe("native Root — pickFiles prop", () => {
  it("calls pickFiles instead of pick(), and adds the returned results", async () => {
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
    expect(pickMock).not.toHaveBeenCalled();
    await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
    expect(ref!.getItems()[0].name).toBe("a");
  });

  it("no-ops silently when pickFiles rejects", async () => {
    const customPickFiles = vi.fn().mockRejectedValue(new Error("boom"));
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

    await expect(ref!.openFileDialog()).resolves.toBeUndefined();
    expect(ref!.getItems()).toHaveLength(0);
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

  it("wires end-to-end with the real adapterReactNativeDocumentsPicker + a mocked pick(), with TFileSource inferred as DocumentPickerResponse", async () => {
    pickMock.mockResolvedValueOnce([
      { uri: "file:///a.png", name: "a.png", type: "image/png" },
    ]);
    let ref: UplofileRootRef<any, DocumentPickerResponse> | null = null;

    render(
      <Root<any, DocumentPickerResponse>
        upload={async (file) => {
          // `file` is typed as DocumentPickerResponse here — .uri is only
          // valid because generic inference flowed from pickFiles through
          // to upload without an explicit cast.
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
