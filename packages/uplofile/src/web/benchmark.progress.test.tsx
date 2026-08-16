/**
 * @vitest-environment jsdom
 *
 * Independent benchmark for PR #45 (this branch), run with the exact same
 * method/scenarios as the main-baseline and pub-sub-store benchmarks (see
 * issue #32) so all three are directly comparable — not just this PR's own
 * self-reported before/after counts.
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

describe("PR #45 benchmark: stableCtx/itemsCtx split + React.memo(PreviewItem)", () => {
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
    const mountCalls = previewItemSpy.mock.calls.length;
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
      `[pr45 single-item] batch=${ITEM_COUNT} ticks=${TICKS} mountCalls=${mountCalls} -> ` +
        `commits=${totals.commits} actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
        `wallClock=${wallMs.toFixed(2)}ms dropzoneCalls=${dropzoneSpy.mock.calls.length} ` +
        `previewItemCalls=${previewItemSpy.mock.calls.length} ` +
        `(Dropzone isolated via stableCtx; PreviewItem shell for the ticking item itself ` +
        `is expected to re-render once per tick — memo alone can't isolate progress from ` +
        `the rest of the same item's props)`,
    );

    dropzoneSpy.mockRestore();
    previewItemSpy.mockRestore();
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
      `[pr45 all-items] batch=${ITEM_COUNT} ticksPerItem=${TICKS_PER_ITEM} ` +
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
        `[pr45 scaling] batch=${itemCount} ticks=${TICKS} (1 item changing) -> ` +
          `actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
          `(${(totals.actualDurationMs / TICKS).toFixed(3)}ms/tick) ` +
          `wallClock=${wallMs.toFixed(2)}ms (${(wallMs / TICKS).toFixed(3)}ms/tick)`,
      );
    },
    30000,
  );
});

describe("PR #45 benchmark: large batch (400-500 concurrent uploads)", () => {
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
        `[pr45 large-batch single-item] batch=${itemCount} ticks=${TICKS} -> ` +
          `actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
          `(${(totals.actualDurationMs / TICKS).toFixed(3)}ms/tick) ` +
          `wallClock=${wallMs.toFixed(2)}ms (${(wallMs / TICKS).toFixed(3)}ms/tick) ` +
          `dropzoneCalls=${dropzoneSpy.mock.calls.length} previewItemCalls=${previewItemSpy.mock.calls.length}`,
      );

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
        `[pr45 large-batch all-items] batch=${itemCount} setItemsCalls=${itemCount} -> ` +
          `actualDuration=${totals.actualDurationMs.toFixed(2)}ms ` +
          `(${(totals.actualDurationMs / itemCount).toFixed(3)}ms/tick) ` +
          `wallClock=${wallMs.toFixed(2)}ms (${(wallMs / itemCount).toFixed(3)}ms/tick) ` +
          `dropzoneCalls=${dropzoneSpy.mock.calls.length} previewItemCalls=${previewItemSpy.mock.calls.length}`,
      );

      dropzoneSpy.mockRestore();
      previewItemSpy.mockRestore();
    },
    30000,
  );
});
