/**
 * @vitest-environment jsdom
 *
 * Benchmark for issue #32, run against the pub-sub store implementation in
 * this branch. Scenarios and method (React.Profiler + vi.spyOn call counts)
 * match a separate baseline run against unmodified main, so the numbers are
 * directly comparable; that baseline isn't included here since it requires
 * `Dropzone`/`PreviewItem` to be spy-able the same way, which main doesn't
 * support out of the box. See the PR body for the side-by-side numbers.
 *
 * Not part of the CI test suite. Run directly:
 *   pnpm --filter uplofile exec vitest run src/web/benchmark.progress.test.tsx
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import React, { Profiler, ProfilerOnRenderCallback } from "react";
import { act, cleanup, render, waitFor } from "@testing-library/react";

import { Root } from "./Root";
import * as DropzoneModule from "./Dropzone";
import * as PreviewModule from "./Preview";
import { Preview } from "./Preview";
import { UplofileRootRef } from "./types";

afterEach(cleanup);

declare var global: typeof globalThis;

if (typeof window !== "undefined") {
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
}

type ProfileTotals = {
  commits: number;
  actualDurationMs: number;
};

function makeProfilerCollector() {
  const totals: ProfileTotals = { commits: 0, actualDurationMs: 0 };
  const onRender: ProfilerOnRenderCallback = (_id, _phase, actualDuration) => {
    totals.commits += 1;
    totals.actualDurationMs += actualDuration;
  };
  return { totals, onRender };
}

describe("fixed: same scenarios run against this branch (compare against main separately)", () => {
  it(`single item ticking inside a 20-item batch, 100 ticks`, async () => {
    const ITEM_COUNT = 20;
    const TICKS = 100;
    const progressCallbacks: Array<(pct: number) => void> = [];
    const uploadMock = vi
      .fn()
      .mockImplementation(
        (_f: File, _s: AbortSignal, setProgress?: (pct: number) => void) => {
          progressCallbacks.push(setProgress!);
          return new Promise(() => {});
        },
      );

    const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
    // Read live via a holder object -- useImperativeHandle's returned handle
    // gets a new identity on every items change (every tick), so capturing
    // the ref value once and reusing it goes stale after the first tick.
    const refHolder: { current: UplofileRootRef | null } = { current: null };
    const { totals, onRender } = makeProfilerCollector();

    render(
      <Profiler id="bench" onRender={onRender}>
        <Root upload={uploadMock} ref={(r) => (refHolder.current = r)}>
          <DropzoneModule.Dropzone data-testid="dz">
            Drop files here
          </DropzoneModule.Dropzone>
          <Preview />
        </Root>
      </Profiler>,
    );

    const files = Array.from(
      { length: ITEM_COUNT },
      (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
    );

    act(() => {
      refHolder.current!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files },
      } as any);
    });

    await waitFor(() => expect(progressCallbacks).toHaveLength(ITEM_COUNT));
    dropzoneSpy.mockClear();
    totals.commits = 0;
    totals.actualDurationMs = 0;

    const wallStart = performance.now();
    for (let t = 1; t <= TICKS; t++) {
      act(() => {
        progressCallbacks[0](t % 100);
      });
    }
    const wallMs = performance.now() - wallStart;

    expect(refHolder.current!.getItems()[0].progress).toBe(TICKS % 100);

    console.log(
      `[fixed single-item] batch=${ITEM_COUNT} ticks=${TICKS} -> ` +
        `commits=${totals.commits} actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
        `wallClock=${wallMs.toFixed(2)}ms dropzoneCalls=${dropzoneSpy.mock.calls.length}`,
    );

    dropzoneSpy.mockRestore();
  });

  it(`all items ticking round-robin, 20-item batch x 20 ticks each (400 setItems calls)`, async () => {
    const ITEM_COUNT = 20;
    const TICKS_PER_ITEM = 20;
    const progressCallbacks: Array<(pct: number) => void> = [];
    const uploadMock = vi
      .fn()
      .mockImplementation(
        (_f: File, _s: AbortSignal, setProgress?: (pct: number) => void) => {
          progressCallbacks.push(setProgress!);
          return new Promise(() => {});
        },
      );

    const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
    const previewItemSpy = vi.spyOn(PreviewModule.PreviewItem, "type" as any);
    const refHolder: { current: UplofileRootRef | null } = { current: null };
    const { totals, onRender } = makeProfilerCollector();

    render(
      <Profiler id="bench" onRender={onRender}>
        <Root upload={uploadMock} ref={(r) => (refHolder.current = r)}>
          <DropzoneModule.Dropzone data-testid="dz">
            Drop files here
          </DropzoneModule.Dropzone>
          <Preview />
        </Root>
      </Profiler>,
    );

    const files = Array.from(
      { length: ITEM_COUNT },
      (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
    );

    act(() => {
      refHolder.current!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files },
      } as any);
    });

    await waitFor(() => expect(progressCallbacks).toHaveLength(ITEM_COUNT));
    dropzoneSpy.mockClear();
    previewItemSpy.mockClear();
    totals.commits = 0;
    totals.actualDurationMs = 0;

    const wallStart = performance.now();
    for (let t = 1; t <= TICKS_PER_ITEM; t++) {
      for (let i = 0; i < ITEM_COUNT; i++) {
        act(() => {
          progressCallbacks[i](t * 5);
        });
      }
    }
    const wallMs = performance.now() - wallStart;

    expect(refHolder.current!.getItems()[ITEM_COUNT - 1].progress).toBe(
      TICKS_PER_ITEM * 5,
    );

    console.log(
      `[fixed all-items] batch=${ITEM_COUNT} ticksPerItem=${TICKS_PER_ITEM} ` +
        `totalSetItemsCalls=${ITEM_COUNT * TICKS_PER_ITEM} -> ` +
        `commits=${totals.commits} actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
        `wallClock=${wallMs.toFixed(2)}ms dropzoneCalls=${dropzoneSpy.mock.calls.length} ` +
        `previewItemCalls=${previewItemSpy.mock.calls.length}`,
    );

    dropzoneSpy.mockRestore();
    previewItemSpy.mockRestore();
  });

  it.each([10, 20, 50, 100])(
    `scaling: single item ticking 30x inside a %i-item batch`,
    async (itemCount) => {
      const TICKS = 30;
      const progressCallbacks: Array<(pct: number) => void> = [];
      const uploadMock = vi
        .fn()
        .mockImplementation(
          (_f: File, _s: AbortSignal, setProgress?: (pct: number) => void) => {
            progressCallbacks.push(setProgress!);
            return new Promise(() => {});
          },
        );

      const refHolder: { current: UplofileRootRef | null } = { current: null };
      const { totals, onRender } = makeProfilerCollector();

      render(
        <Profiler id="bench" onRender={onRender}>
          <Root upload={uploadMock} ref={(r) => (refHolder.current = r)}>
            <DropzoneModule.Dropzone data-testid="dz">
              Drop files here
            </DropzoneModule.Dropzone>
            <Preview />
          </Root>
        </Profiler>,
      );

      const files = Array.from(
        { length: itemCount },
        (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
      );

      act(() => {
        refHolder.current!.onDrop({
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          dataTransfer: { files },
        } as any);
      });

      await waitFor(() => expect(progressCallbacks).toHaveLength(itemCount));
      totals.commits = 0;
      totals.actualDurationMs = 0;

      const wallStart = performance.now();
      for (let t = 1; t <= TICKS; t++) {
        act(() => {
          progressCallbacks[0](t);
        });
      }
      const wallMs = performance.now() - wallStart;

      expect(refHolder.current!.getItems()[0].progress).toBe(TICKS);

      console.log(
        `[fixed scaling] batch=${itemCount} ticks=${TICKS} (1 item changing) -> ` +
          `actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
          `(${(totals.actualDurationMs / TICKS).toFixed(3)}ms/tick) ` +
          `wallClock=${wallMs.toFixed(2)}ms (${(wallMs / TICKS).toFixed(3)}ms/tick)`,
      );
    },
  );
});

describe("pub-sub store: leaf isolation beyond Dropzone (issue #32 decision #4)", () => {
  it("PreviewItem shell never re-renders on a progress tick, even for the ticking item", async () => {
    const ITEM_COUNT = 20;
    const TICKS = 100;
    const progressCallbacks: Array<(pct: number) => void> = [];
    const uploadMock = vi
      .fn()
      .mockImplementation(
        (_f: File, _s: AbortSignal, setProgress?: (pct: number) => void) => {
          progressCallbacks.push(setProgress!);
          return new Promise(() => {});
        },
      );

    const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
    // PreviewItem is wrapped in React.memo, so vi.spyOn can't wrap the
    // exported memo object directly — React reads `.type` (the render
    // function) off that same object reference on every render, so
    // spying on `.type` in place intercepts it correctly.
    const previewItemSpy = vi.spyOn(PreviewModule.PreviewItem, "type" as any);
    const refHolder: { current: UplofileRootRef | null } = { current: null };
    const { totals, onRender } = makeProfilerCollector();

    render(
      <Profiler id="bench" onRender={onRender}>
        <Root upload={uploadMock} ref={(r) => (refHolder.current = r)}>
          <DropzoneModule.Dropzone data-testid="dz">
            Drop files here
          </DropzoneModule.Dropzone>
          <Preview />
        </Root>
      </Profiler>,
    );

    const files = Array.from(
      { length: ITEM_COUNT },
      (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
    );

    act(() => {
      refHolder.current!.onDrop({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { files },
      } as any);
    });

    await waitFor(() => expect(progressCallbacks).toHaveLength(ITEM_COUNT));

    // One PreviewItem call per item to mount them as "uploading" — this is
    // the cost floor, not part of what ticks add.
    const mountCalls = previewItemSpy.mock.calls.length;
    dropzoneSpy.mockClear();
    previewItemSpy.mockClear();
    totals.commits = 0;
    totals.actualDurationMs = 0;

    for (let t = 1; t <= TICKS; t++) {
      act(() => {
        progressCallbacks[0](t % 100);
      });
    }

    expect(refHolder.current!.getItems()[0].progress).toBe(TICKS % 100);

    console.log(
      `[pubsub leaf-isolation] batch=${ITEM_COUNT} ticks=${TICKS} mountCalls=${mountCalls} -> ` +
        `dropzoneCalls=${dropzoneSpy.mock.calls.length} previewItemCalls=${previewItemSpy.mock.calls.length} ` +
        `(both expected 0: neither Dropzone nor the ticking item's own PreviewItem shell ` +
        `re-renders — isolation goes one level deeper than PR #45's memo-only fix, which ` +
        `still re-renders the ticking item's shell on every tick)`,
    );

    // The whole point of decision #4: unlike memo-only (which still re-renders
    // the *ticking* item's shell every tick — PR #45's own numbers show this
    // scaling 1:1 with tick count), the store keeps the shell call count flat
    // at zero regardless of how many ticks happen.
    expect(dropzoneSpy.mock.calls.length).toBe(0);
    expect(previewItemSpy.mock.calls.length).toBe(0);

    dropzoneSpy.mockRestore();
    previewItemSpy.mockRestore();
  });
});

describe("pub-sub store: large batch (400-500 concurrent uploads)", () => {
  it.each([400, 500])(
    `single item ticking 50x inside a %i-item batch`,
    async (itemCount) => {
      const TICKS = 50;
      const progressCallbacks: Array<(pct: number) => void> = [];
      const uploadMock = vi
        .fn()
        .mockImplementation(
          (_f: File, _s: AbortSignal, setProgress?: (pct: number) => void) => {
            progressCallbacks.push(setProgress!);
            return new Promise(() => {});
          },
        );

      const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
      const previewItemSpy = vi.spyOn(PreviewModule.PreviewItem, "type" as any);
      const refHolder: { current: UplofileRootRef | null } = { current: null };
      const { totals, onRender } = makeProfilerCollector();

      render(
        <Profiler id="bench" onRender={onRender}>
          <Root upload={uploadMock} ref={(r) => (refHolder.current = r)}>
            <DropzoneModule.Dropzone data-testid="dz">
              Drop files here
            </DropzoneModule.Dropzone>
            <Preview />
          </Root>
        </Profiler>,
      );

      const files = Array.from(
        { length: itemCount },
        (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
      );

      act(() => {
        refHolder.current!.onDrop({
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          dataTransfer: { files },
        } as any);
      });

      await waitFor(() => expect(progressCallbacks).toHaveLength(itemCount));
      dropzoneSpy.mockClear();
      previewItemSpy.mockClear();
      totals.commits = 0;
      totals.actualDurationMs = 0;

      const wallStart = performance.now();
      for (let t = 1; t <= TICKS; t++) {
        act(() => {
          progressCallbacks[0](t % 100);
        });
      }
      const wallMs = performance.now() - wallStart;

      expect(refHolder.current!.getItems()[0].progress).toBe(TICKS % 100);

      console.log(
        `[pubsub large-batch single-item] batch=${itemCount} ticks=${TICKS} -> ` +
          `actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
          `(${(totals.actualDurationMs / TICKS).toFixed(3)}ms/tick) ` +
          `wallClock=${wallMs.toFixed(2)}ms (${(wallMs / TICKS).toFixed(3)}ms/tick) ` +
          `dropzoneCalls=${dropzoneSpy.mock.calls.length} previewItemCalls=${previewItemSpy.mock.calls.length}`,
      );

      expect(dropzoneSpy.mock.calls.length).toBe(0);
      expect(previewItemSpy.mock.calls.length).toBe(0);

      dropzoneSpy.mockRestore();
      previewItemSpy.mockRestore();
    },
    30000,
  );

  it.each([400, 500])(
    `all items ticking once each in a %i-item batch`,
    async (itemCount) => {
      const progressCallbacks: Array<(pct: number) => void> = [];
      const uploadMock = vi
        .fn()
        .mockImplementation(
          (_f: File, _s: AbortSignal, setProgress?: (pct: number) => void) => {
            progressCallbacks.push(setProgress!);
            return new Promise(() => {});
          },
        );

      const dropzoneSpy = vi.spyOn(DropzoneModule, "Dropzone");
      const previewItemSpy = vi.spyOn(PreviewModule.PreviewItem, "type" as any);
      const refHolder: { current: UplofileRootRef | null } = { current: null };
      const { totals, onRender } = makeProfilerCollector();

      render(
        <Profiler id="bench" onRender={onRender}>
          <Root upload={uploadMock} ref={(r) => (refHolder.current = r)}>
            <DropzoneModule.Dropzone data-testid="dz">
              Drop files here
            </DropzoneModule.Dropzone>
            <Preview />
          </Root>
        </Profiler>,
      );

      const files = Array.from(
        { length: itemCount },
        (_, i) => new File([`f${i}`], `f${i}.jpg`, { type: "image/jpeg" }),
      );

      act(() => {
        refHolder.current!.onDrop({
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          dataTransfer: { files },
        } as any);
      });

      await waitFor(() => expect(progressCallbacks).toHaveLength(itemCount));
      dropzoneSpy.mockClear();
      previewItemSpy.mockClear();
      totals.commits = 0;
      totals.actualDurationMs = 0;

      const wallStart = performance.now();
      for (let i = 0; i < itemCount; i++) {
        act(() => {
          progressCallbacks[i](50);
        });
      }
      const wallMs = performance.now() - wallStart;

      expect(refHolder.current!.getItems()[itemCount - 1].progress).toBe(50);

      console.log(
        `[pubsub large-batch all-items] batch=${itemCount} setItemsCalls=${itemCount} -> ` +
          `actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
          `(${(totals.actualDurationMs / itemCount).toFixed(3)}ms/tick) ` +
          `wallClock=${wallMs.toFixed(2)}ms (${(wallMs / itemCount).toFixed(3)}ms/tick) ` +
          `dropzoneCalls=${dropzoneSpy.mock.calls.length} previewItemCalls=${previewItemSpy.mock.calls.length}`,
      );

      expect(dropzoneSpy.mock.calls.length).toBe(0);
      expect(previewItemSpy.mock.calls.length).toBe(0);

      dropzoneSpy.mockRestore();
      previewItemSpy.mockRestore();
    },
    30000,
  );
});
