## [3.0.1](https://github.com/KristofaJosh/uplofile/compare/v3.0.0...v3.0.1) (2026-07-01)


### Bug Fixes

* remove legacy react-native field to resolve Metro export warning ([#26](https://github.com/KristofaJosh/uplofile/issues/26)) ([74a2b39](https://github.com/KristofaJosh/uplofile/commit/74a2b39a76b65a45acd9909c270e2e64b98e5d37))

# [3.0.0](https://github.com/KristofaJosh/uplofile/compare/v2.3.2...v3.0.0) (2026-05-15)


### Features

* add React Native support via uplofile/native entry point ([#17](https://github.com/KristofaJosh/uplofile/issues/17)) ([6f4da35](https://github.com/KristofaJosh/uplofile/commit/6f4da35cf27fa9688db1a75970663a08ca768657))


### BREAKING CHANGES

* cleanup and improvements

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking

- **uplofile**: `acceptsFile` now follows standard HTML `accept` extension syntax more closely. Extension tokens must be dot-prefixed (for example, `.pdf`, `.mp4`, `.tar.gz`); no-dot extension tokens such as `pdf` or `mp4` are treated as invalid and ignored. If all `accept` tokens are invalid, files are allowed to match browser-permissive behavior.

### Added

- **uplofile**: New `uplofile/native` entry point for React Native. Import from `uplofile/native` to get `Root`, `Trigger`, and `Preview` components that use `@react-native-documents/picker` instead of DOM file input. (#new-feature)
- **uplofile**: Extract platform-agnostic `useUplofileState` hook from the web `Root` component. This hook powers both web and RN entry points with zero code duplication.
- **uplofile**: Add `getFileName`, `createPreviewUrl`, and `revokePreviewUrl` adapter parameters to `useUplofileState` for platform-agnostic file source handling.

### Changed

- **uplofile**: Restructure `src/` into `shared/`, `web/`, and `native/` directories. Web component imports remain unchanged via the default `uplofile` entry point.
- **uplofile**: `UploadFileItem.file` and `RootProps.upload` now accept a generic `TFileSource` parameter (defaults to `File` for backward compatibility).
- **uplofile**: `ImageUploaderContextValue.fileInputProps` and `getDropzoneProps` are now marked optional/deprecated — they are web-only and not present in the RN context.

## [2.3.2] - 2026-05-13

### Changed

- **uplofile**: Fix stale `items` closures in `selectFiles`, `remove`, and `retry` by using an `itemsRef` always kept in sync via `useLayoutEffect`, so concurrent drops/removes never read old state.
- **uplofile**: Fix object URL (`blob:`) memory leak — track all created blob URLs in a `Set<string>` ref and revoke them when uploads finish, items are removed, or the root unmounts (previously only the initial mount snapshot was cleaned).
- **uplofile**: Fix optimistic remove rollback — restore only the removed item instead of replacing the entire state snapshot, preventing overwrites of items added concurrently during deletion.
- **uplofile**: Memoize provider value (`ctx`) and all stable callbacks (`openFileDialog`, `getDropzoneProps`, `fileInputProps`) so consumers only re-render when their specific dependencies change.
- **uplofile**: Remove unsafe `(result as any).preview` fallback — use typed `result.previewUrl ?? result.url` instead.
- **uplofile**: Remove unnecessary `(next as any)(prev)` cast in `emitChange` — TypeScript narrowing works directly.
- **uplofile**: Extract default `Preview` into 8 focused subcomponents (`ErrorBadge`, `VideoPreview`, `ImagePreview`, `FilePlaceholder`, `MediaContent`, `UploadingOverlay`, `ActionButtons`, `PreviewItem`) for maintainability.
- **uplofile**: Remove Tailwind utility classes from default `Preview` in favor of `uplofile-*` BEM classes and the `className` prop, aligning with the library's unstyled philosophy.
- **uplofile**: Add `aria-label`, `role="progressbar"`, and `aria-busy` semantics to `Preview` action buttons and status overlays for improved accessibility.
- **uplofile**: Compute derived upload summary in `Trigger` via `useMemo` to avoid repeated array scans on every render.

### Added

- **uplofile**: Export `acceptsFile` utility for reuse by consumers.

## [2.2.6] - 2026-02-14

### Added

- **uplofile**: Expose `data-dragging` on `Dropzone` for styling drag state.
- **uplofile**: Enhance `beforeUpload` hook to accept previous items and remaining count.

## [2.2.2] - 2026-02-09

### Added

- **uplofile**: Support async initialization of `initial` prop with `MaybePromise` type.
- **uplofile**: Add support for `previewUrl` and `meta` in `UploadResult` for enhanced file handling.
- **uplofile**: Export `BeforeUploadResult` type for improved type safety in hooks and components.
- **uplofile**: Add `onLoadingChange` callback prop and imperative ref support to track `isLoading` state changes.
- **docs**: Add examples for waiting on initial files using `isLoading` and subscribing via `ref.onLoadingChange` under Examples → Loading State.

## [2.1.0] - 2026-02-08

### Added

- **uplofile**: Add `beforeUpload` hook for custom file validation and enrichment (#7).

### Changed

- **docs**: Update import examples in README for improved clarity.

## [2.0.0] - 2026-02-08

### Added

- **uplofile**: Major feature "outcontext" (#6) allowing usage outside of context providers.

### Changed

- Major release with updated internal architecture.

## [1.1.1] - 2026-01-30

### Fixed

- **build**: Update `.npmignore` to ensure clean package distribution.

## [1.1.0] - 2026-01-30

### Added

- **uplofile**: Expose `setItems` function (#5) to allow manual state management of uploaded items.

## [1.0.1] - 2026-01-11

### Changed

- **docs**: Remove beta status from documentation and README.
- **build**: Optimize package bundling by deduping `react` and `react-dom` in Vite config (#3).

## [1.0.0] - 2024-12-15

### Added

- Full production release.
- **docs**: Integration with Vercel adapter and analytics.
- **docs**: Comprehensive file upload examples and playground.
- **ci**: GitHub Actions workflow for automated releases.
- **docs**: Mobile navigation for documentation.

### Changed

- **docs**: Replaced Astro with React for documentation site for better component reuse.
- **docs**: Significant improvements to README and API documentation.
- **build**: Extracted postbuild scripts for better maintenance.

## [1.0.0-beta.1] - 2024-12-15

### Added

- Initial beta release.
- **uplofile**: Core `uplofile` component implementation.
- **docs**: Basic documentation and installation instructions.

## [0.1.0] - 2024-08-10

### Added

- Initial setup and project structure.
- Basic file upload functionality.
