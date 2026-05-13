/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  act,
  cleanup,
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Root } from "./Root";
import { Dropzone } from "./Dropzone";
import { Trigger } from "./Trigger";
import { Preview } from "./Preview";
import { UploadFileItem, UplofileRootRef } from "../shared/types";

afterEach(cleanup);

declare var global: typeof globalThis;

// Mock URL methods
if (typeof window !== "undefined") {
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
}

describe("Components", () => {
  const mockUpload = vi
    .fn()
    .mockResolvedValue({ url: "https://example.com/file.jpg" });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Dropzone", () => {
    it("should render and apply dropzone props", () => {
      render(
        <Root upload={mockUpload}>
          <Dropzone data-testid="dropzone">Drop files here</Dropzone>
        </Root>,
      );

      const dropzone = screen.getByTestId("dropzone");
      expect(dropzone).toBeDefined();
      expect(dropzone.getAttribute("data-part")).toBe("dropzone");
      expect(dropzone.getAttribute("role")).toBe("button");
      expect(dropzone.tabIndex).toBe(0);
    });

    it("should support asChild prop", () => {
      render(
        <Root upload={mockUpload}>
          <Dropzone asChild>
            <section data-testid="custom-dropzone">Custom Dropzone</section>
          </Dropzone>
        </Root>,
      );

      const dropzone = screen.getByTestId("custom-dropzone");
      expect(dropzone.tagName).toBe("SECTION");
      expect(dropzone.getAttribute("data-part")).toBe("dropzone");
    });

    it("should expose drag state via data attribute", () => {
      render(
        <Root upload={mockUpload}>
          <Dropzone data-testid="dropzone-drag">Drop files here</Dropzone>
        </Root>,
      );

      const dropzone = screen.getByTestId("dropzone-drag");
      expect(dropzone.getAttribute("data-dragging")).toBeNull();

      fireEvent.dragEnter(dropzone);
      expect(dropzone.getAttribute("data-dragging")).toBe("true");

      fireEvent.dragLeave(dropzone);
      expect(dropzone.getAttribute("data-dragging")).toBeNull();
    });

    it("should not share drag state across multiple dropzones", () => {
      render(
        <Root upload={mockUpload}>
          <Dropzone data-testid="dropzone-a">A</Dropzone>
          <Dropzone data-testid="dropzone-b">B</Dropzone>
        </Root>,
      );

      const dropzoneA = screen.getByTestId("dropzone-a");
      const dropzoneB = screen.getByTestId("dropzone-b");

      fireEvent.dragEnter(dropzoneA);
      expect(dropzoneA.getAttribute("data-dragging")).toBe("true");
      expect(dropzoneB.getAttribute("data-dragging")).toBeNull();

      fireEvent.dragLeave(dropzoneA);
      expect(dropzoneA.getAttribute("data-dragging")).toBeNull();
      expect(dropzoneB.getAttribute("data-dragging")).toBeNull();
    });
  });

  describe("Trigger", () => {
    it("should render as a button by default and handle click", async () => {
      render(
        <Root upload={mockUpload}>
          <Trigger data-testid="trigger">Upload</Trigger>
        </Root>,
      );

      const trigger = screen.getByTestId("trigger");
      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger.getAttribute("data-part")).toBe("trigger");

      await userEvent.click(trigger);
    });

    it("opens the hidden input once on click by default", async () => {
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const { getByTestId } = render(
        <Root upload={mockUpload}>
          <Trigger data-testid="trigger-default">Upload</Trigger>
        </Root>,
      );

      await userEvent.click(getByTestId("trigger-default"));
      expect(clickSpy).toHaveBeenCalledTimes(1);
      clickSpy.mockRestore();
    });

    it("composes consumer onClick and still opens when not prevented", async () => {
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const handler = vi.fn();
      const { getByTestId } = render(
        <Root upload={mockUpload}>
          <Trigger data-testid="trigger-compose" onClick={handler}>
            Upload
          </Trigger>
        </Root>,
      );

      await userEvent.click(getByTestId("trigger-compose"));
      expect(handler).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalledTimes(1);
      clickSpy.mockRestore();
    });

    it("allows consumer to prevent default open via onClick", async () => {
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const { getByTestId } = render(
        <Root upload={mockUpload}>
          <Trigger
            data-testid="trigger-prevent"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Upload
          </Trigger>
        </Root>,
      );

      await userEvent.click(getByTestId("trigger-prevent"));
      expect(clickSpy).not.toHaveBeenCalled();
      clickSpy.mockRestore();
    });

    it("should support render prop with api", () => {
      render(
        <Root upload={mockUpload}>
          <Trigger
            render={({ uploadingCount }) => (
              <span data-testid="uploading-count">{uploadingCount}</span>
            )}
          />
        </Root>,
      );

      expect(screen.getByTestId("uploading-count").textContent).toBe("0");
    });

    it("should be disabled when disabled prop is passed to Root", () => {
      render(
        <Root upload={mockUpload} disabled>
          <Trigger data-testid="trigger-disabled">Upload</Trigger>
        </Root>,
      );

      const trigger = screen.getByTestId("trigger-disabled");
      expect(trigger.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("Preview", () => {
    const items: Partial<UploadFileItem>[] = [
      {
        uid: "1",
        name: "test1.jpg",
        status: "done",
        url: "https://example.com/1.jpg",
      },
      {
        uid: "2",
        name: "test2.mp4",
        status: "uploading",
        progress: 50,
        previewUrl: "blob:mock-url",
      },
      { uid: "3", name: "test3.png", status: "error", error: "Upload failed" },
    ];

    it("should render nothing when there are no items", () => {
      render(
        <Root upload={mockUpload}>
          <Preview />
        </Root>,
      );

      expect(document.querySelector('[data-part="preview"]')).toBeNull();
    });

    it("should render items correctly", async () => {
      render(
        <Root upload={mockUpload} initial={items as any}>
          <Preview />
        </Root>,
      );

      await waitFor(() => {
        expect(screen.getByAltText("test1.jpg")).toBeDefined();
        expect(document.querySelector("video")).toBeDefined();
        const errorItem = document.querySelector('[data-state="error"]');
        expect(errorItem).toBeDefined();
      });
    });

    it("should support render prop", async () => {
      render(
        <Root upload={mockUpload} initial={items as any}>
          <Preview
            render={({ items }) => (
              <ul data-testid="custom-preview">
                {items.map((item) => (
                  <li key={item.uid}>{item.name}</li>
                ))}
              </ul>
            )}
          />
        </Root>,
      );

      await waitFor(() => {
        const list = screen.getByTestId("custom-preview");
        expect(list.children).toHaveLength(3);
        expect(list.children[0].textContent).toBe("test1.jpg");
      });
    });

    it("should apply aria-busy on uploading and removing items", async () => {
      let ref: UplofileRootRef | null = null;
      const slowUpload = vi.fn().mockReturnValue(new Promise(() => {}));

      render(
        <Root upload={slowUpload} ref={(r) => (ref = r)}>
          <Preview />
        </Root>,
      );

      ref!.setItems([
        {
          uid: "u1",
          name: "active.jpg",
          status: "uploading" as const,
          url: "blob:mock-url",
        },
        {
          uid: "u2",
          name: "removing.jpg",
          status: "removing" as const,
          url: "https://example.com/r.jpg",
        },
        {
          uid: "u3",
          name: "done.jpg",
          status: "done" as const,
          url: "https://example.com/d.jpg",
        },
      ] as any);

      await waitFor(() => {
        expect(document.querySelectorAll('[aria-busy="true"]')).toHaveLength(2);
      });
    });

    it("should render progressbar role on uploading overlay", async () => {
      let ref: UplofileRootRef | null = null;
      let setProgress: ((pct: number) => void) | undefined;
      const uploadMock = vi
        .fn()
        .mockImplementation(
          (_f: File, _s: AbortSignal, sp?: (pct: number) => void) => {
            setProgress = sp;
            return new Promise(() => {});
          },
        );

      render(
        <Root upload={uploadMock} ref={(r) => (ref = r)}>
          <Preview />
        </Root>,
      );

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      ref!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files: [file] },
      } as any);

      await waitFor(() => {
        expect(ref!.getItems()).toHaveLength(1);
      });

      expect(typeof setProgress).toBe("function");

      act(() => setProgress!(75));

      await waitFor(() => {
        const items = ref!.getItems();
        expect(items[0].progress).toBe(75);
      });

      await waitFor(() => {
        const bar = document.querySelector('[role="progressbar"]');
        expect(bar).toBeDefined();
        expect(bar!.getAttribute("aria-valuenow")).toBe("75");
      });
    });
  });
});
