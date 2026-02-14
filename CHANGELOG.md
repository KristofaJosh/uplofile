# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.4] - 2026-02-14

### Added

- **uplofile**: Allow `Dropzone` `className` to be a function that receives drag state for styling.
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
