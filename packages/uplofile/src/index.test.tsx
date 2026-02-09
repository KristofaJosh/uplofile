/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Root } from "./context";
import { UplofileRootRef } from "./types";

// Mock URL methods
if (typeof window !== "undefined") {
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
}

describe("Root Component", () => {
  const mockUpload = vi
    .fn()
    .mockResolvedValue({ url: "https://example.com/file.jpg" });

  describe("initial prop", () => {
    it("should hydrate from synchronous array", async () => {
      const initial = [
        { uid: "1", name: "test1.jpg", url: "https://example.com/1.jpg" },
      ];
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={mockUpload} initial={initial} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
      expect(ref!.getItems()[0].name).toBe("test1.jpg");
      expect(ref!.getItems()[0].status).toBe("done");
    });

    it("should hydrate from immediate promise", async () => {
      const initial = Promise.resolve([
        { uid: "2", name: "test2.jpg", url: "https://example.com/2.jpg" },
      ]);
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={mockUpload} initial={initial} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
      expect(ref!.getItems()[0].name).toBe("test2.jpg");
    });

    it("should hydrate from delayed promise", async () => {
      const initial = new Promise<any[]>((resolve) => {
        setTimeout(
          () =>
            resolve([
              { uid: "3", name: "test3.jpg", url: "https://example.com/3.jpg" },
            ]),
          10,
        );
      });
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={mockUpload} initial={initial} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      await waitFor(() => expect(ref!.getItems()).toHaveLength(1));
      expect(ref!.getItems()[0].name).toBe("test3.jpg");
    });
  });

  describe("beforeUpload feature", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should allow upload when beforeUpload returns true", async () => {
      const beforeUpload = vi.fn().mockResolvedValue(true);
      let ref: UplofileRootRef | null = null;

      render(
        <Root
          upload={mockUpload}
          beforeUpload={beforeUpload}
          ref={(r) => (ref = r)}
        >
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      // Simulate file selection
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalled());
      await waitFor(() => expect(mockUpload).toHaveBeenCalled());

      expect(ref!.getItems()).toHaveLength(1);
      expect(ref!.getItems()[0].status).toBe("done");
    });

    it("should reject all files when beforeUpload returns false", async () => {
      const beforeUpload = vi.fn().mockResolvedValue(false);
      let ref: UplofileRootRef | null = null;

      render(
        <Root
          upload={mockUpload}
          beforeUpload={beforeUpload}
          ref={(r) => (ref = r)}
        >
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalled());

      expect(mockUpload).not.toHaveBeenCalled();
      expect(ref!.getItems()).toHaveLength(0);
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it("should filter files based on validation array (valid: false)", async () => {
      const beforeUpload = vi.fn().mockImplementation(async (items) => {
        return items.map((item: { uid: any }, index: number) => ({
          uid: item.uid,
          valid: index === 0, // only the first one is valid
        }));
      });

      let ref: UplofileRootRef | null = null;

      render(
        <Root
          upload={mockUpload}
          beforeUpload={beforeUpload}
          ref={(r) => (ref = r)}
        >
          <div />
        </Root>,
      );

      const file1 = new File(["test1"], "test1.jpg", { type: "image/jpeg" });
      const file2 = new File(["test2"], "test2.jpg", { type: "image/jpeg" });

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file1, file2],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalled());
      await waitFor(() => expect(mockUpload).toHaveBeenCalledTimes(1));

      const items = ref!.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe("test1.jpg");
    });

    it("should add item with error if reason is provided for invalid item", async () => {
      const beforeUpload = vi.fn().mockImplementation(async (items) => {
        return items.map((item: { uid: any }) => ({
          uid: item.uid,
          valid: false,
          reason: "Too big",
        }));
      });

      let ref: UplofileRootRef | null = null;

      render(
        <Root
          upload={mockUpload}
          beforeUpload={beforeUpload}
          ref={(r) => (ref = r)}
        >
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalled());

      expect(mockUpload).not.toHaveBeenCalled();

      const items = ref!.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].status).toBe("error");
      expect(items[0].error).toBe("Too big");
    });

    it("should enrich items with meta and id", async () => {
      const beforeUpload = vi.fn().mockImplementation(async (items) => {
        return items.map((item: { uid: any }) => ({
          uid: item.uid,
          valid: true,
          meta: { custom: "data" },
          id: "predefined-id",
        }));
      });

      let ref: UplofileRootRef | null = null;

      render(
        <Root
          upload={mockUpload}
          beforeUpload={beforeUpload}
          ref={(r) => (ref = r)}
        >
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalled());
      await waitFor(() => expect(mockUpload).toHaveBeenCalled());

      const items = ref!.getItems();
      expect(items[0].meta).toEqual({ custom: "data" });
      expect(items[0].id).toBe("predefined-id");
    });
  });
});
