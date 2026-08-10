# Uplofile Agent Guide

Welcome to the Uplofile project. This guide provides essential context and instructions for AI agents working on this codebase.

## Agent Constraints

- **Minimize Output Tokens:** Keep responses concise, clear, and specific. Avoid unnecessary verbosity or repetition.
- **Stay Updated:** This guide must be updated whenever project requirements, architecture, or core logic changes significantly. Agents are responsible for ensuring this file reflects the current state of the project.

## Project Overview

Uplofile is a React library providing composable file-upload components. See the [root README](README.md) for the full philosophy and positioning.

## Agent Skills

Reusable, agent-agnostic workflows (e.g. drafting PRs, filing issues) live in `.agents/skills/`. Check there before improvising a workflow the repo already has a skill for.

## Project Structure

This is a monorepo managed with `pnpm`.

- `packages/uplofile`: The core library source code.
  - `src/shared/`: Platform-agnostic core (types, state machine, utils, hook)
  - `src/web/`: Web-specific UI (Root, Dropzone, Trigger, Preview, icons)
  - `src/native/`: React Native-specific UI (Root, Trigger, Preview)
- `app/doc-remix`: The documentation website (Remix + React Router v7 + Tailwind SSR).
- `app/doc-native`: React Native playground (Expo) for testing `uplofile/native` during development.

## Tech Stack

- **Language:** TypeScript
- **Framework:** React
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS (mostly in docs, library components are unstyled)
- **Bundler:** Bunchee (for the library), Vite (for the docs via Remix)
- **Testing:** Vitest
- **Release Automation:** Changesets (via `.github/workflows/publish.yml`)

## Release Process

Releases go through a manual review gate via [Changesets](https://github.com/changesets/changesets). Only `packages/uplofile` is published; the `app/*` workspaces are ignored (see `.changeset/config.json`).

### How it works

1. On a feature branch, add a changeset for any user-facing change: `pnpm changeset` — pick a bump type (patch/minor/major) and write a summary. Commit the generated `.changeset/*.md` file with the PR. PRs with no changeset simply won't trigger a version bump (e.g. pure `chore`/`docs`/`ci`/`refactor` changes to non-shipped code need no changeset).
2. CI (`.github/workflows/ci.yml`) runs tests/e2e on every PR.
3. On merge to `main`, `.github/workflows/publish.yml` runs once CI on `main` succeeds (via `workflow_run`, so it never re-runs tests it already saw pass):
   - If there are unreleased changesets, the `changesets/action` opens/updates a **"Version Packages"** PR that bumps `packages/uplofile/package.json` and prepends the changelog entries to `packages/uplofile/CHANGELOG.md`. No publish happens yet.
   - Merging the "Version Packages" PR is the manual approval gate. That merge (once CI on `main` succeeds again) triggers the same workflow, which now finds no pending changesets and instead publishes to npm (OIDC trusted publishing — no static tokens) and creates a GitHub Release.

### Manual trigger

The workflow can also be triggered manually via the GitHub UI (Actions → Release → Run workflow).

## Core Components & Concepts

Two entry points: `uplofile` (web, default) and `uplofile/native` (React Native). Full component and prop reference lives in the [root README](README.md#core-components--concepts) — keep it in sync with `src/shared/types.ts` when APIs change.

## Development Guidelines

### Coding Standards
- Use functional components and hooks.
- Ensure all components are accessible (A11y).
- Keep the library unstyled; use `className` and `style` props for customization.
- Strictly follow the types defined in `src/shared/types.ts`.
- **Remove unused imports:** Before committing, always check for and remove any unused imports across the codebase.

### Testing
- Tests are located alongside source files (e.g., `*.test.tsx`).
- Run unit tests using `pnpm test` in the relevant package or root.
- Use `screen.getBy...` and user events for testing components.
- **E2E tests** live in `app/doc-remix/e2e/` and use Playwright against the doc-remix dev server.
- Run e2e tests: `pnpm --filter doc-remix test:e2e`
- E2E tests run in CI on every PR (see `ci.yml`). The config auto-starts the dev server.

### Adding New Features
1. Update `src/shared/types.ts` if any new props or state are needed.
2. Implement cross-platform logic in `src/shared/context.tsx` (or web-only in `src/web/Root.tsx`).
3. Create/update components in `src/web/` or `src/native/`.
4. Add tests for the new functionality (co-located with components).
5. Update documentation in `app/doc-remix` (Ensure SSR-friendly rendering using ClientOnly boundaries if needed).
6. **CRITICAL:** Update `app/doc-remix/public/llms.txt` if the core logic, usage examples, or API changes, to ensure AI bots have up-to-date context.

## Common Tasks for Agents

- **Bug Fixes:** Check `src/shared/context.tsx` for state logic issues or `src/web/` for UI bugs.
- **Refactoring:** Ensure props are passed correctly through the context shared across web and native.
- **Documentation:** Updates should be made in `app/doc-remix/app` or in the package README. Also, ensure `app/doc-remix/public/llms.txt` accurately reflects any new APIs or architectural philosophies.
- **New Components (Web):** Follow the pattern of `Trigger` or `Dropzone` in `src/web/`, ensuring they use the `useUplofile` hook.
- **New Components (Native):** Follow the pattern of `Trigger` or `Preview` in `src/native/`, ensuring they use the `useUplofile` hook.

## Troubleshooting

- **State Issues:** The library uses a complex state object for items. Verify how `setItems` is called in `src/shared/context.tsx`.
- **Upload Cancellation:** Ensure the `AbortSignal` is correctly passed and handled in the `upload` function.
- **Preview Rendering:** `UplofilePreview` is a composite component; check how it renders children if they are provided.
