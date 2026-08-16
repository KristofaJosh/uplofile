import { describe, expect, it, vi } from "vitest";

import {
  adapterExpoDocumentPicker,
  adapterExpoImagePicker,
  adapterReactNativeDocumentsPicker,
  adapterReactNativeImagePicker,
} from "./adapters";

describe("adapterReactNativeDocumentsPicker", () => {
  it("forwards accept/multiple and returns the picked results", async () => {
    const pick = vi.fn(async (_options: any) => [
      { uri: "file:///a.pdf", name: "a.pdf", type: "application/pdf" },
    ]);
    const pickFiles = adapterReactNativeDocumentsPicker(pick);

    const result = await pickFiles("application/pdf", { multiple: false });

    expect(pick).toHaveBeenCalledWith({
      type: ["application/pdf"],
      allowMultiSelection: false,
    });
    expect(result).toEqual([
      { uri: "file:///a.pdf", name: "a.pdf", type: "application/pdf" },
    ]);
  });

  it("filters out results that don't match accept", async () => {
    const pick = vi.fn(async () => [
      { uri: "file:///a.pdf", name: "a.pdf", type: "application/pdf" },
      { uri: "file:///a.png", name: "a.png", type: "image/png" },
    ]);
    const pickFiles = adapterReactNativeDocumentsPicker(pick);

    const result = await pickFiles("image/*", { multiple: true });

    expect(result).toEqual([
      { uri: "file:///a.png", name: "a.png", type: "image/png" },
    ]);
  });

  it("resolves to an empty array when the picker throws OPERATION_CANCELED", async () => {
    const pick = vi.fn(async () => {
      const err = new Error("cancelled") as Error & { code: string };
      err.code = "OPERATION_CANCELED";
      throw err;
    });
    const pickFiles = adapterReactNativeDocumentsPicker(pick);

    await expect(pickFiles(undefined, { multiple: true })).resolves.toEqual([]);
  });

  it("rethrows non-cancellation errors", async () => {
    const pick = vi.fn(async () => {
      throw new Error("boom");
    });
    const pickFiles = adapterReactNativeDocumentsPicker(pick);

    await expect(pickFiles(undefined, { multiple: true })).rejects.toThrow(
      "boom",
    );
  });
});

describe("adapterExpoDocumentPicker", () => {
  it("forwards accept/multiple and returns assets on success", async () => {
    const getDocumentAsync = vi.fn(async (_options: any) => ({
      canceled: false as const,
      assets: [
        { uri: "file:///a.pdf", name: "a.pdf", mimeType: "application/pdf" },
      ],
    }));
    const pickFiles = adapterExpoDocumentPicker(getDocumentAsync);

    const result = await pickFiles("application/pdf", { multiple: true });

    expect(getDocumentAsync).toHaveBeenCalledWith({
      type: ["application/pdf"],
      multiple: true,
    });
    expect(result).toEqual([
      { uri: "file:///a.pdf", name: "a.pdf", mimeType: "application/pdf" },
    ]);
  });

  it("filters out assets that don't match accept", async () => {
    const getDocumentAsync = vi.fn(async () => ({
      canceled: false as const,
      assets: [
        { uri: "file:///a.pdf", name: "a.pdf", mimeType: "application/pdf" },
        { uri: "file:///a.png", name: "a.png", mimeType: "image/png" },
      ],
    }));
    const pickFiles = adapterExpoDocumentPicker(getDocumentAsync);

    const result = await pickFiles("image/*", { multiple: true });

    expect(result).toEqual([
      { uri: "file:///a.png", name: "a.png", mimeType: "image/png" },
    ]);
  });

  it("resolves to an empty array when canceled: true", async () => {
    const getDocumentAsync = vi.fn(async () => ({
      canceled: true as const,
      assets: null,
    }));
    const pickFiles = adapterExpoDocumentPicker(getDocumentAsync);

    await expect(pickFiles(undefined, { multiple: true })).resolves.toEqual([]);
  });
});

describe("adapterExpoImagePicker", () => {
  it("ignores accept, always requests images+videos, and returns assets", async () => {
    const launchImageLibraryAsync = vi.fn(async (_options: any) => ({
      canceled: false as const,
      assets: [{ uri: "file:///a.jpg" }],
    }));
    const pickFiles = adapterExpoImagePicker(launchImageLibraryAsync);

    const result = await pickFiles("application/pdf", { multiple: false });

    expect(launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: false,
    });
    expect(result).toEqual([{ uri: "file:///a.jpg" }]);
  });

  it("resolves to an empty array when canceled: true", async () => {
    const launchImageLibraryAsync = vi.fn(async () => ({
      canceled: true as const,
      assets: null,
    }));
    const pickFiles = adapterExpoImagePicker(launchImageLibraryAsync);

    await expect(pickFiles(undefined, { multiple: true })).resolves.toEqual([]);
  });

  it("warns once (dev-only) when a non-image/video accept is passed, and not for image/video accept", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const launchImageLibraryAsync = vi.fn(async () => ({
      canceled: true as const,
      assets: null,
    }));
    const pickFiles = adapterExpoImagePicker(launchImageLibraryAsync);

    await pickFiles("image/*", { multiple: true });
    expect(warnSpy).not.toHaveBeenCalled();

    await pickFiles("application/pdf", { multiple: true });
    expect(warnSpy).toHaveBeenCalledTimes(1);

    await pickFiles("application/pdf", { multiple: true });
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  it("warns separately per adapter instance", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const launchImageLibraryAsync = vi.fn(async () => ({
      canceled: true as const,
      assets: null,
    }));
    const pickFilesA = adapterExpoImagePicker(launchImageLibraryAsync);
    const pickFilesB = adapterExpoImagePicker(launchImageLibraryAsync);

    await pickFilesA("application/pdf", { multiple: true });
    await pickFilesB("application/pdf", { multiple: true });

    expect(warnSpy).toHaveBeenCalledTimes(2);

    warnSpy.mockRestore();
  });

  it("suppresses the accept-mismatch warning when __DEV__ is false (RN production build)", async () => {
    const g = globalThis as { __DEV__?: boolean };
    const previousDev = g.__DEV__;
    g.__DEV__ = false;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const launchImageLibraryAsync = vi.fn(async () => ({
      canceled: true as const,
      assets: null,
    }));
    const pickFiles = adapterExpoImagePicker(launchImageLibraryAsync);

    await pickFiles("application/pdf", { multiple: true });

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    g.__DEV__ = previousDev;
  });

  it("suppresses the accept-mismatch warning via NODE_ENV=production when __DEV__ is unset", async () => {
    const g = globalThis as { __DEV__?: boolean };
    const previousDev = g.__DEV__;
    delete g.__DEV__;
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const launchImageLibraryAsync = vi.fn(async () => ({
      canceled: true as const,
      assets: null,
    }));
    const pickFiles = adapterExpoImagePicker(launchImageLibraryAsync);

    await pickFiles("application/pdf", { multiple: true });

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    process.env.NODE_ENV = previousNodeEnv;
    g.__DEV__ = previousDev;
  });
});

describe("adapterReactNativeImagePicker", () => {
  it("ignores accept, maps multiple to selectionLimit, and returns assets", async () => {
    const launchImageLibrary = vi.fn(async (_options: any) => ({
      assets: [{ uri: "file:///a.jpg" }],
    }));
    const pickFiles = adapterReactNativeImagePicker(launchImageLibrary);

    const result = await pickFiles("application/pdf", { multiple: true });

    expect(launchImageLibrary).toHaveBeenCalledWith({
      mediaType: "mixed",
      selectionLimit: 0,
    });
    expect(result).toEqual([{ uri: "file:///a.jpg" }]);
  });

  it("maps multiple: false to selectionLimit: 1", async () => {
    const launchImageLibrary = vi.fn(async () => ({ assets: [] }));
    const pickFiles = adapterReactNativeImagePicker(launchImageLibrary);

    await pickFiles(undefined, { multiple: false });

    expect(launchImageLibrary).toHaveBeenCalledWith({
      mediaType: "mixed",
      selectionLimit: 1,
    });
  });

  it("resolves to an empty array when didCancel is true", async () => {
    const launchImageLibrary = vi.fn(async () => ({ didCancel: true }));
    const pickFiles = adapterReactNativeImagePicker(launchImageLibrary);

    await expect(pickFiles(undefined, { multiple: true })).resolves.toEqual([]);
  });

  it("throws using errorMessage when errorCode is present", async () => {
    const launchImageLibrary = vi.fn(async () => ({
      errorCode: "camera_unavailable",
      errorMessage: "Camera not available",
    }));
    const pickFiles = adapterReactNativeImagePicker(launchImageLibrary);

    await expect(pickFiles(undefined, { multiple: true })).rejects.toThrow(
      "Camera not available",
    );
  });

  it("throws using errorCode when errorMessage is absent", async () => {
    const launchImageLibrary = vi.fn(async () => ({
      errorCode: "permission",
    }));
    const pickFiles = adapterReactNativeImagePicker(launchImageLibrary);

    await expect(pickFiles(undefined, { multiple: true })).rejects.toThrow(
      "permission",
    );
  });

  it("warns once (dev-only) when a non-image/video accept is passed", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const launchImageLibrary = vi.fn(async () => ({ didCancel: true }));
    const pickFiles = adapterReactNativeImagePicker(launchImageLibrary);

    await pickFiles("video/*", { multiple: true });
    expect(warnSpy).not.toHaveBeenCalled();

    await pickFiles("text/plain", { multiple: true });
    await pickFiles("text/plain", { multiple: true });
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });
});
