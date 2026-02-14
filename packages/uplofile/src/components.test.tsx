/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Root } from "./context";
import { Dropzone } from "./components/dropzone";
import { Trigger } from "./components/trigger";
import { Preview } from "./components/preview";
import { UploadFileItem } from "./types";

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
  });

  describe("Trigger", () => {
    it("should render as a button by default and handle click", () => {
      render(
        <Root upload={mockUpload}>
          <Trigger data-testid="trigger">Upload</Trigger>
        </Root>,
      );

      const trigger = screen.getByTestId("trigger");
      expect(trigger.tagName).toBe("BUTTON");
      expect(trigger.getAttribute("data-part")).toBe("trigger");

      fireEvent.click(trigger);
      // Clicking should trigger openFileDialog which eventually calls input click.
      // We can't easily test the file picker opening in JSDOM, but we can verify it doesn't throw.
    });

    it("opens the hidden input once on click by default", () => {
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const { getByTestId } = render(
        <Root upload={mockUpload}>
          <Trigger data-testid="trigger-default">Upload</Trigger>
        </Root>,
      );

      fireEvent.click(getByTestId("trigger-default"));
      expect(clickSpy).toHaveBeenCalledTimes(1);
      clickSpy.mockRestore();
    });

    it("composes consumer onClick and still opens when not prevented", () => {
      const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
      const handler = vi.fn();
      const { getByTestId } = render(
        <Root upload={mockUpload}>
          <Trigger data-testid="trigger-compose" onClick={handler}>
            Upload
          </Trigger>
        </Root>,
      );

      fireEvent.click(getByTestId("trigger-compose"));
      expect(handler).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalledTimes(1);
      clickSpy.mockRestore();
    });

    it("allows consumer to prevent default open via onClick", () => {
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

      fireEvent.click(getByTestId("trigger-prevent"));
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
        // test2.mp4 is video (detected by .mp4 extension)
        expect(document.querySelector("video")).toBeDefined();
        // test3.png is error
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
  });
});
