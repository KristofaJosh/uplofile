/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";
import { Root } from "./Root";
import { Trigger } from "./Trigger";
import { UplofileRootRef } from "../shared/types";

afterEach(cleanup);

declare var global: typeof globalThis;

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

    it("should provide isLoading state during hydration", async () => {
      let resolveHydration: (value: any[]) => void;
      const initial = new Promise<any[]>((resolve) => {
        resolveHydration = resolve;
      });
      let isLoadingValue = false;

      render(
        <Root upload={mockUpload} initial={initial}>
          <Trigger
            render={({ isLoading }) => {
              isLoadingValue = isLoading;
              return null;
            }}
          />
        </Root>,
      );

      expect(isLoadingValue).toBe(true);

      await waitFor(() => {
        resolveHydration([
          { uid: "4", name: "test4.jpg", url: "https://example.com/4.jpg" },
        ]);
      });

      await waitFor(() => expect(isLoadingValue).toBe(false));
    });

    it("should provide isLoading state via imperative ref", async () => {
      let resolveHydration: (value: any[]) => void;
      const initial = new Promise<any[]>((resolve) => {
        resolveHydration = resolve;
      });
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={mockUpload} initial={initial} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      expect(ref!.isLoading).toBe(true);

      await waitFor(() => {
        resolveHydration([
          { uid: "5", name: "test5.jpg", url: "https://example.com/5.jpg" },
        ]);
      });

      await waitFor(() => expect(ref!.isLoading).toBe(false));
    });

    it("should call onLoadingChange prop when isLoading changes", async () => {
      let resolveHydration: (value: any[]) => void;
      const initial = new Promise<any[]>((resolve) => {
        resolveHydration = resolve;
      });
      const onLoadingChange = vi.fn();

      render(
        <Root
          upload={mockUpload}
          initial={initial}
          onLoadingChange={onLoadingChange}
        >
          <div />
        </Root>,
      );

      expect(onLoadingChange).toHaveBeenCalledWith(true);

      await waitFor(() => {
        resolveHydration([
          { uid: "6", name: "test6.jpg", url: "https://example.com/6.jpg" },
        ]);
      });

      await waitFor(() => expect(onLoadingChange).toHaveBeenCalledWith(false));
    });

    it("should call onLoadingChange set via imperative ref", async () => {
      let resolveHydration: (value: any[]) => void;
      const initial = new Promise<any[]>((resolve) => {
        resolveHydration = resolve;
      });
      const onLoadingChange = vi.fn();
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={mockUpload} initial={initial} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      ref!.onLoadingChange = onLoadingChange;

      await waitFor(() => {
        resolveHydration([
          { uid: "7", name: "test7.jpg", url: "https://example.com/7.jpg" },
        ]);
      });

      await waitFor(() => expect(onLoadingChange).toHaveBeenCalledWith(false));
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

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [file],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalled());
      expect(beforeUpload).toHaveBeenCalledTimes(1);
      const [items, state] = beforeUpload.mock.calls[0];
      expect(items).toHaveLength(1);
      expect(state).toHaveProperty("prevItems");
      expect(state).toHaveProperty("remaining");
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

    it("should pass prevItems, remaining, maxCount, and accept to beforeUpload", async () => {
      const beforeUpload = vi.fn().mockResolvedValue(true);
      let ref: UplofileRootRef | null = null;

      render(
        <Root
          upload={mockUpload}
          beforeUpload={beforeUpload}
          maxCount={10}
          accept="image/*"
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
      expect(beforeUpload).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          prevItems: [],
          remaining: 10,
          maxCount: 10,
          accept: "image/*",
        }),
      );
    });

    it("should pass prevItems with existing items when adding new files", async () => {
      const beforeUpload = vi.fn().mockImplementation(async (_items, state) => {
        return true;
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

      const existingFile = new File(["test"], "existing.jpg", {
        type: "image/jpeg",
      });
      const newFile = new File(["test"], "new.jpg", { type: "image/jpeg" });

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [existingFile],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalledTimes(1));

      const firstCallArgs = beforeUpload.mock.calls[0];
      expect(firstCallArgs[1].prevItems).toHaveLength(0);

      vi.clearAllMocks();

      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: {
          files: [newFile],
        },
      } as any);

      await waitFor(() => expect(beforeUpload).toHaveBeenCalledTimes(1));

      const secondCallArgs = beforeUpload.mock.calls[0];
      expect(secondCallArgs[1].prevItems).toHaveLength(1);
      expect(secondCallArgs[1].prevItems[0].name).toBe("existing.jpg");
    });
  });

  describe("Upload result handling", () => {
    it("should apply meta and previewUrl from upload result", async () => {
      const customResult = {
        url: "https://example.com/final.jpg",
        previewUrl: "https://example.com/preview.jpg",
        meta: { custom: "data" },
      };
      const upload = vi.fn().mockResolvedValue(customResult);
      let ref: UplofileRootRef<any> | null = null;

      render(
        <Root upload={upload} ref={(r) => (ref = r)}>
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

      await waitFor(() => expect(upload).toHaveBeenCalled());
      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const item = ref!.getItems()[0];
      expect(item.url).toBe(customResult.url);
      expect(item.previewUrl).toBe(customResult.previewUrl);
      expect(item.meta).toEqual(customResult.meta);
    });
  });

  describe("Item actions (cancel, retry, remove)", () => {
    const upload = vi.fn().mockResolvedValue({ url: "https://example.com/file.jpg" });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should cancel an in-progress upload and mark item as canceled", async () => {
      let ref: UplofileRootRef | null = null;
      const slowUpload = vi.fn().mockImplementation(
        (_file: File, signal: AbortSignal) =>
          new Promise((_resolve, reject) => {
            signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      );

      render(
        <Root upload={slowUpload} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()).toHaveLength(1));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.cancel(uid);

      await waitFor(() => {
        const item = ref!.getItems()[0];
        expect(item.status).toBe("canceled");
      });
    });

    it("should retry a failed upload", async () => {
      let ref: UplofileRootRef | null = null;
      let attempts = 0;

      const flakyUpload = vi.fn().mockImplementation(() => {
        attempts++;
        if (attempts === 1) {
          return Promise.reject(new Error("Network error"));
        }
        return Promise.resolve({ url: "https://example.com/file.jpg" });
      });

      render(
        <Root upload={flakyUpload} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("error"));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.retry(uid);

      await waitFor(() => {
        const item = ref!.getItems()[0];
        expect(item.status).toBe("done");
      });

      expect(flakyUpload).toHaveBeenCalledTimes(2);
    });

    it("should remove item immediately when no onRemove provided", async () => {
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => expect(ref!.getItems()).toHaveLength(0));
    });

    it("should call onRemove and remove item on success (optimistic)", async () => {
      const onRemove = vi.fn().mockResolvedValue(undefined);
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} onRemove={onRemove} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => {
        expect(onRemove).toHaveBeenCalled();
        expect(ref!.getItems()).toHaveLength(0);
      });
    });

    it("should restore item when onRemove throws (optimistic rollback)", async () => {
      const onRemove = vi.fn().mockRejectedValue(new Error("Server error"));
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} onRemove={onRemove} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => {
        expect(onRemove).toHaveBeenCalled();
        const items = ref!.getItems();
        expect(items).toHaveLength(1);
        expect(items[0].uid).toBe(uid);
        expect(items[0].status).toBe("done");
      });
    });

    it("should remove item after onRemove succeeds in strict mode", async () => {
      const onRemove = vi.fn().mockResolvedValue(undefined);
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} onRemove={onRemove} removeMode="strict" ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => {
        expect(onRemove).toHaveBeenCalled();
        expect(ref!.getItems()).toHaveLength(0);
      });
    });

    it("should keep item with done status when onRemove fails in strict mode", async () => {
      const onRemove = vi.fn().mockRejectedValue(new Error("Server error"));
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} onRemove={onRemove} removeMode="strict" ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => {
        expect(onRemove).toHaveBeenCalled();
        const items = ref!.getItems();
        expect(items).toHaveLength(1);
        expect(items[0].uid).toBe(uid);
        expect(items[0].status).toBe("done");
      });
    });
  });

  describe("Blob URL lifecycle", () => {
    const upload = vi.fn().mockResolvedValue({ url: "https://example.com/file.jpg" });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should revoke blob URL when upload completes", async () => {
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should revoke blob URL gracefully when removing after upload (already revoked on success)", async () => {
      let ref: UplofileRootRef | null = null;

      render(
        <Root upload={upload} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()[0].status).toBe("done"));

      const callCount = vi.mocked(global.URL.revokeObjectURL).mock.calls.length;
      expect(callCount).toBeGreaterThanOrEqual(1);

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => expect(ref!.getItems()).toHaveLength(0));
    });

    it("should revoke blob URL when removing before upload completes", async () => {
      let ref: UplofileRootRef | null = null;
      const slowUpload = vi.fn();
      slowUpload.mockReturnValue(new Promise(() => {}));

      render(
        <Root upload={slowUpload} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()).toHaveLength(1));

      vi.mocked(global.URL.revokeObjectURL).mockClear();

      const uid = ref!.getItems()[0].uid;
      ref!.actions.remove(uid);

      await waitFor(() => expect(ref!.getItems()).toHaveLength(0));
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("should revoke blob URLs on unmount when items still pending", async () => {
      const neverResolve = vi.fn().mockReturnValue(new Promise(() => {}));
      let ref: UplofileRootRef | null = null;

      const { unmount } = render(
        <Root upload={neverResolve} ref={(r) => (ref = r)}>
          <div />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => expect(ref!.getItems()).toHaveLength(1));

      vi.mocked(global.URL.revokeObjectURL).mockClear();

      unmount();

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });
});
