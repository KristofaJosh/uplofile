# Uplofile Agent Guide

Welcome to the Uplofile project. This guide provides essential context and instructions for AI agents working on this codebase.

## Agent Constraints

- **Minimize Output Tokens:** Keep responses concise, clear, and specific. Avoid unnecessary verbosity or repetition.
- **Stay Updated:** This guide must be updated whenever project requirements, architecture, or core logic changes significantly. Agents are responsible for ensuring this file reflects the current state of the project.

## Project Overview

Uplofile is a React library providing composable file-upload components. It follows a "bring your own upload logic" philosophy, focusing on UI state management and orchestration rather than specific transport protocols or backends.

### Key Philosophy
- **Uploads are infrastructure concerns disguised as UI problems.**
- The library stays backend-agnostic and protocol-agnostic.
- Focus is on React's strengths: UI state, lifecycle, and composability.

## Project Structure

This is a monorepo managed with `pnpm`.

- `packages/uplofile`: The core library source code.
  - `src/components`: UI components (Dropzone, Preview, Trigger, etc.).
  - `src/context.tsx`: The `Root` component and state management.
  - `src/hook.ts`: `useUplofile` hook for custom integrations.
  - `src/types.ts`: TypeScript definitions for the entire library.
  - `src/utils.ts`: Helper functions (file type checks, etc.).
- `app/doc-remix`: The documentation website (Remix + React Router v7 + Tailwind SSR).

## Tech Stack

- **Language:** TypeScript
- **Framework:** React
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS (mostly in docs, library components are unstyled)
- **Bundler:** Bunchee (for the library), Vite (for the docs via Remix)
- **Testing:** Vitest
- **Release Automation:** semantic-release (via `.github/workflows/publish.yml`)

## Release Process

Releases are triggered by pushing commits to `main`. **semantic-release** handles the entire release automatically.

### How it works

1. Push commits to `main` following **Conventional Commits** format:
   - `feat: ...` → **minor** version bump
   - `fix: ...` → **patch** version bump
   - `BREAKING CHANGE: ...` → **major** version bump
   - `chore: ...`, `docs: ...`, `refactor: ...` → **no release**
2. `.github/workflows/publish.yml` runs on every push to `main`
3. The commit-analyzer scans commits since the last tag:
   - Only `feat`/`fix`/`BREAKING CHANGE` trigger a release
   - `chore`/`docs`/`refactor`/`test`/`ci` → analyzer returns `null` → **no release**
4. If a release is triggered, `semantic-release`:
   - Updates `packages/uplofile/package.json` version
   - Updates `CHANGELOG.md` with release notes
   - Commits both files and creates a `v{x.y.z}` tag
   - Publishes to npm (OIDC trusted publishing — no static tokens)
   - Creates a GitHub Release

### Manual trigger

The workflow can also be triggered manually via the GitHub UI (Actions → Release → Run workflow).

## Core Components & Concepts

### `UplofileRoot` (context.tsx)
The provider component that manages the upload state.
- **Props:** `upload` (required), `onRemove`, `multiple`, `maxCount`, `accept`, `beforeUpload`, `removeMode`.
- **`upload` function:** Should return a `Promise<UploadResult>`. It receives `file`, `signal` (for cancellation), and `setProgress`.

### `UplofileDropzone`
Handles drag-and-drop interactions.

### `UplofileTrigger`
The element that opens the file selection dialog.

### `UplofilePreview`
Displays the list of files being uploaded, their status, and progress.

### `Item Actions`
- `Cancel`: Aborts an ongoing upload.
- `Remove`: Removes a file (and optionally calls `onRemove`).
- `Retry`: Re-attempts a failed upload.

### `UploadStatus`
Items can be in one of these states: `idle`, `uploading`, `done`, `error`, `canceled`, `removing`.

## Development Guidelines

### Coding Standards
- Use functional components and hooks.
- Ensure all components are accessible (A11y).
- Keep the library unstyled; use `className` and `style` props for customization.
- Strictly follow the types defined in `src/types.ts`.

### Testing
- Tests are located alongside source files (e.g., `*.test.tsx`).
- Run unit tests using `pnpm test` in the relevant package or root.
- Use `screen.getBy...` and user events for testing components.
- **E2E tests** live in `app/doc-remix/e2e/` and use Playwright against the doc-remix dev server.
- Run e2e tests: `pnpm --filter doc-remix test:e2e`
- E2E tests run in CI on every PR (see `ci.yml`). The config auto-starts the dev server.

### Adding New Features
1. Update `types.ts` if any new props or state are needed.
2. Implement logic in `context.tsx` or `hook.ts`.
3. Create/update components in `src/components`.
4. Add tests for the new functionality.
5. Update documentation in `app/doc-remix` (Ensure SSR-friendly rendering using ClientOnly boundaries if needed).
6. **CRITICAL:** Update `app/doc-remix/public/llms.txt` if the core logic, usage examples, or API changes, to ensure AI bots have up-to-date context.

## Common Tasks for Agents

- **Bug Fixes:** Check `src/context.tsx` for state logic issues or `src/components` for UI bugs.
- **Refactoring:** Ensure props are passed correctly through the context.
- **Documentation:** Updates should be made in `app/doc-remix/app` or in the package README. Also, ensure `app/doc-remix/public/llms.txt` accurately reflects any new APIs or architectural philosophies.
- **New Components:** Follow the pattern of `Trigger` or `Dropzone`, ensuring they use the `useUplofile` hook.

## Troubleshooting

- **State Issues:** The library uses a complex state object for items. Verify how `setItems` is called in `context.tsx`.
- **Upload Cancellation:** Ensure the `AbortSignal` is correctly passed and handled in the `upload` function.
- **Preview Rendering:** `UplofilePreview` is a composite component; check how it renders children if they are provided.
