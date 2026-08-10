/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, render, waitFor } from "@testing-library/react";

import { Root } from "./Root";
import * as DropzoneModule from "./Dropzone";
import { Preview, PreviewItem } from "./Preview";
import { UplofileRootRef } from "./types";

afterEach(cleanup);

declare var global: typeof globalThis;

if (typeof window !== "undefined") {
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
}

// Counting actual render-function invocations (not commits) is what proves a
// component was skipped: React.memo bails without calling the wrapped
// function at all, and a plain function component that never re-renders
// (because its only context subscription didn't change) is never called
// either. Spying on the underlying function — `.type` for a memo component,
// the exported binding itself for a plain one — observes exactly that,
// unlike a `<Profiler>`, whose onRender fires on every commit regardless of
// whether the wrapped subtree actually did work.
describe("render isolation on progress ticks", () => {
  it("a progress update on one item does not re-render Dropzone or sibling PreviewItems", async () => {
    const ITEM_COUNT = 5;
    const progressCallbacks: Array<(pct: number) => void> = [];
    const uploadMock = vi
      .fn()
      .mockImplementation(
        (_file: File, _signal: AbortSignal, setProgress?: (pct: number) => void) => {
          progressCallbacks.push(setProgress!);
          return new Promise(() => {});
        },
      );

    const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
    const itemSpy = vi.spyOn(PreviewItem as any, "type");

    let ref: UplofileRootRef | null = null;

    render(
      <Root upload={uploadMock} ref={(r) => (ref = r)}>
        <DropzoneModule.Dropzone data-testid="dz">Drop files here</DropzoneModule.Dropzone>
        <Preview />
      </Root>,
    );

    const files = Array.from(
      { length: ITEM_COUNT },
      (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
    );

    ref!.onDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files },
    } as any);

    await waitFor(() => expect(progressCallbacks).toHaveLength(ITEM_COUNT));

    // Settle the batch-start renders before measuring the isolated tick.
    dropzoneSpy.mockClear();
    itemSpy.mockClear();

    act(() => {
      progressCallbacks[0](40);
    });
    await waitFor(() => expect(ref!.getItems()[0].progress).toBe(40));

    // eslint-disable-next-line no-console
    console.log(
      "[render-isolation] 1 tick / 5-item batch -> dropzone calls:",
      dropzoneSpy.mock.calls.length,
      "PreviewItem calls:",
      itemSpy.mock.calls.length,
    );

    expect(dropzoneSpy).not.toHaveBeenCalled();
    // Only the one progressing item should have re-rendered; the other 4 stay untouched.
    expect(itemSpy).toHaveBeenCalledTimes(1);

    dropzoneSpy.mockRestore();
    itemSpy.mockRestore();
  });

  it("N progress ticks on one item out of a batch: before/after render totals", async () => {
    const ITEM_COUNT = 10;
    const TICKS = 5;
    const progressCallbacks: Array<(pct: number) => void> = [];
    const uploadMock = vi
      .fn()
      .mockImplementation(
        (_file: File, _signal: AbortSignal, setProgress?: (pct: number) => void) => {
          progressCallbacks.push(setProgress!);
          return new Promise(() => {});
        },
      );

    const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
    const itemSpy = vi.spyOn(PreviewItem as any, "type");

    let ref: UplofileRootRef | null = null;

    render(
      <Root upload={uploadMock} ref={(r) => (ref = r)}>
        <DropzoneModule.Dropzone data-testid="dz">Drop files here</DropzoneModule.Dropzone>
        <Preview />
      </Root>,
    );

    const files = Array.from(
      { length: ITEM_COUNT },
      (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
    );

    ref!.onDrop({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files },
    } as any);

    await waitFor(() => expect(progressCallbacks).toHaveLength(ITEM_COUNT));

    dropzoneSpy.mockClear();
    itemSpy.mockClear();

    for (let t = 1; t <= TICKS; t++) {
      act(() => {
        progressCallbacks[0](t * 20);
      });
      await waitFor(() => expect(ref!.getItems()[0].progress).toBe(t * 20));
    }

    // eslint-disable-next-line no-console
    console.log(
      `[render-isolation] batch=${ITEM_COUNT} ticks=${TICKS} -> dropzone calls=${dropzoneSpy.mock.calls.length} PreviewItem calls=${itemSpy.mock.calls.length} (ideal PreviewItem calls=${TICKS})`,
    );

    expect(dropzoneSpy).not.toHaveBeenCalled();
    // Only the progressing item should ever re-render — one call per tick,
    // regardless of how many other items are in the batch.
    expect(itemSpy.mock.calls.length).toBe(TICKS);

    dropzoneSpy.mockRestore();
    itemSpy.mockRestore();
  });
});
