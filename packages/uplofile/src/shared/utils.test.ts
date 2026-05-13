import { describe, it, expect } from "vitest";
import {
  isVideoFile,
  isImageFile,
  getExtension,
  acceptsFile,
  getValidAcceptTokens,
  getNativePickerAcceptTypes,
} from "./utils";

describe("utils", () => {
  describe("isVideoFile", () => {
    it("should detect video by MIME type", () => {
      const item: any = {
        file: { type: "video/mp4" },
      };
      expect(isVideoFile(item)).toBe(true);
    });

    it("should detect video by extension in URL", () => {
      const item: any = {
        url: "https://example.com/video.mp4",
      };
      expect(isVideoFile(item)).toBe(true);
    });

    it("should handle URLs with query parameters", () => {
      const item: any = {
        url: "https://example.com/video.mp4?token=123",
      };
      expect(isVideoFile(item)).toBe(true);
    });

    it("should detect video by name", () => {
      const item: any = {
        name: "my-movie.mkv",
      };
      expect(isVideoFile(item)).toBe(true);
    });

    it("should return false for non-video files", () => {
      const item: any = {
        name: "image.jpg",
      };
      expect(isVideoFile(item)).toBe(false);
    });

    it("should allow adding custom video extensions", () => {
      const item: any = {
        name: "movie.custom",
      };
      expect(isVideoFile(item)).toBe(false);
      expect(isVideoFile(item, ["custom"])).toBe(true);
    });
  });

  describe("isImageFile", () => {
    it("should detect image by MIME type", () => {
      const item: any = {
        file: { type: "image/jpeg" },
      };
      expect(isImageFile(item)).toBe(true);
    });

    it("should detect image by extension in URL", () => {
      const item: any = {
        url: "https://example.com/image.png",
      };
      expect(isImageFile(item)).toBe(true);
    });

    it("should detect image by name", () => {
      const item: any = {
        name: "photo.webp",
      };
      expect(isImageFile(item)).toBe(true);
    });

    it("should return false for non-image files", () => {
      const item: any = {
        name: "document.pdf",
      };
      expect(isImageFile(item)).toBe(false);
    });

    it("should allow adding custom image extensions", () => {
      const item: any = {
        name: "picture.special",
      };
      expect(isImageFile(item)).toBe(false);
      expect(isImageFile(item, ["special"])).toBe(true);
    });
  });

  describe("getExtension", () => {
    it("should extract extension from a simple filename", () => {
      expect(getExtension("test.mp4")).toBe("mp4");
    });

    it("should extract extension from a path", () => {
      expect(getExtension("/path/to/file.png")).toBe("png");
    });

    it("should handle multiple dots in filename", () => {
      expect(getExtension("archive.tar.gz")).toBe("gz");
    });

    it("should handle URLs with query parameters", () => {
      expect(
        getExtension("https://example.com/video.mp4?token=abc&expiry=123"),
      ).toBe("mp4");
    });

    it("should handle URLs with fragments", () => {
      expect(getExtension("https://example.com/video.mp4#t=10")).toBe("mp4");
    });

    it("should handle both query parameters and fragments", () => {
      expect(getExtension("https://example.com/video.mp4?a=b#c=d")).toBe("mp4");
    });

    it("should return undefined if no dot exists", () => {
      expect(getExtension("filename")).toBe(undefined);
    });

    it("should convert extension to lowercase", () => {
      expect(getExtension("PHOTO.JPEG")).toBe("jpeg");
    });

    it("should handle complex local paths that might fail URL constructor", () => {
      expect(getExtension("some/local/file.webp?v=1")).toBe("webp");
    });
  });

  describe("acceptsFile", () => {
    const makeFile = (name: string, type: string): File => {
      return new File(["content"], name, { type });
    };

    it("allows when accept is empty", () => {
      const f = makeFile("photo.jpg", "image/jpeg");
      expect(acceptsFile(f, "")).toBe(true);
    });

    it("allows when accept contains only malformed tokens", () => {
      const f = makeFile("document.pdf", "application/pdf");
      expect(acceptsFile(f, "*")).toBe(true);
      expect(acceptsFile(f, ", *, /, image/, */, image/png;foo")).toBe(true);
    });

    it("matches exact MIME type", () => {
      const f = makeFile("photo.png", "image/png");
      expect(acceptsFile(f, "image/png")).toBe(true);
      expect(acceptsFile(f, "image/jpeg")).toBe(false);
    });

    it("matches wildcard MIME type", () => {
      const f = makeFile("photo.webp", "image/webp");
      expect(acceptsFile(f, "image/*")).toBe(true);
      expect(acceptsFile(f, "video/*")).toBe(false);
    });

    it("matches dot-prefixed extension tokens", () => {
      const f = makeFile("movie.mp4", "video/mp4");
      expect(acceptsFile(f, ".mp4")).toBe(true);
      expect(acceptsFile(f, ".mov")).toBe(false);
    });

    it("ignores no-dot extension tokens as malformed", () => {
      const f = makeFile("movie.mp4", "video/mp4");
      expect(acceptsFile(f, "mp4")).toBe(true);
      expect(acceptsFile(f, "mp4,image/jpeg")).toBe(false);
    });

    it("matches dot-prefixed suffixes for non-media and compound file names", () => {
      const archive = makeFile("backup.tar.gz", "application/gzip");
      const certificate = makeFile("identity.pem", "application/x-pem-file");

      expect(acceptsFile(archive, ".tar.gz")).toBe(true);
      expect(acceptsFile(archive, ".gz")).toBe(true);
      expect(acceptsFile(certificate, ".pem")).toBe(true);
      expect(acceptsFile(certificate, ".key")).toBe(false);
    });

    it("handles comma-separated tokens and whitespace", () => {
      const f = makeFile("icon.svg", "image/svg+xml");
      expect(acceptsFile(f, "image/png, image/*, .svg")).toBe(true);
    });

    it("ignores malformed tokens when valid tokens are present", () => {
      const f = makeFile("notes.txt", "text/plain");
      expect(acceptsFile(f, "*, image/*, .txt")).toBe(true);
      expect(acceptsFile(f, "*, image/*")).toBe(false);
    });
  });

  describe("getValidAcceptTokens", () => {
    it("returns valid standard accept tokens", () => {
      expect(
        getValidAcceptTokens("*, .pdf, mp4, image/*, text/plain, .tar.gz"),
      ).toEqual([".pdf", "image/*", "text/plain", ".tar.gz"]);
    });

    it("returns undefined when all accept tokens are malformed", () => {
      expect(getValidAcceptTokens("*")).toBe(undefined);
      expect(getValidAcceptTokens("mp4, image/, /plain")).toBe(undefined);
    });
  });

  describe("getNativePickerAcceptTypes", () => {
    it("passes MIME-only accept filters through to the native picker", () => {
      expect(getNativePickerAcceptTypes("image/*,application/pdf")).toEqual([
        "image/*",
        "application/pdf",
      ]);
    });

    it("opens the native picker unrestricted when extension filters are present", () => {
      expect(getNativePickerAcceptTypes(".pdf,image/*")).toBe(undefined);
      expect(getNativePickerAcceptTypes(".tar.gz")).toBe(undefined);
    });
  });
});
