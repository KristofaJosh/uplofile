import { afterEach, describe, expect, it, vi } from "vitest";

const platform = vi.hoisted(() => ({ OS: "ios" as string }));
vi.mock("react-native", () => ({ Platform: platform }));

import { getDocumentsPickerTypes } from "./documentsPickerTypes";

afterEach(() => {
  platform.OS = "ios";
});

describe("getDocumentsPickerTypes — iOS", () => {
  it("maps wildcard MIME types to UTIs", () => {
    expect(getDocumentsPickerTypes("image/*")).toEqual(["public.image"]);
    expect(getDocumentsPickerTypes("image/*, video/*, audio/*")).toEqual([
      "public.image",
      "public.movie",
      "public.audio",
    ]);
    expect(getDocumentsPickerTypes("*/*")).toEqual(["public.item"]);
    expect(getDocumentsPickerTypes("text/*")).toEqual(["public.text"]);
  });

  it("maps exact MIME types to UTIs, case-insensitively", () => {
    expect(getDocumentsPickerTypes("Application/PDF")).toEqual([
      "com.adobe.pdf",
    ]);
    expect(
      getDocumentsPickerTypes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toEqual(["org.openxmlformats.wordprocessingml.document"]);
  });

  it("dedupes MIME aliases that share a UTI", () => {
    expect(
      getDocumentsPickerTypes("text/csv,text/comma-separated-values"),
    ).toEqual(["public.comma-separated-values-text"]);
  });

  it("falls back to no OS filter when any token has no UTI", () => {
    expect(getDocumentsPickerTypes("image/png")).toBeUndefined();
    expect(getDocumentsPickerTypes("image/*,image/heic")).toBeUndefined();
  });

  it("ignores malformed tokens rather than dropping the filter", () => {
    expect(getDocumentsPickerTypes("image/*,foo")).toEqual(["public.image"]);
  });

  it("returns undefined for no accept or extension tokens", () => {
    expect(getDocumentsPickerTypes(undefined)).toBeUndefined();
    expect(getDocumentsPickerTypes("")).toBeUndefined();
    expect(getDocumentsPickerTypes("   ")).toBeUndefined();
    expect(getDocumentsPickerTypes(".png")).toBeUndefined();
  });
});

describe("getDocumentsPickerTypes — non-iOS", () => {
  it("passes MIME types through unchanged", () => {
    platform.OS = "android";
    expect(getDocumentsPickerTypes("image/*")).toEqual(["image/*"]);
    expect(getDocumentsPickerTypes("image/png,application/pdf")).toEqual([
      "image/png",
      "application/pdf",
    ]);
  });

  it("passes MIME types through unchanged on other platforms", () => {
    platform.OS = "web";
    expect(getDocumentsPickerTypes("image/*")).toEqual(["image/*"]);
  });
});
