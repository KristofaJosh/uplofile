# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-02-08

### Added
- **uplofile**: Add `beforeUpload` hook for custom file validation and enrichment (#7).

### Changed
- **uplofile**: Update import examples in README for improved clarity.

## [2.0.0] - 2026-02-08

### Added
- **uplofile**: Major feature "outcontext" (#6) allowing usage outside of context providers.

### Changed
- Major release with updated internal architecture.

## [1.1.1] - 2026-01-30

### Fixed
- Update `.npmignore` to ensure clean package distribution.

## [1.1.0] - 2026-01-30

### Added
- **uplofile**: Expose `setItems` function (#5) to allow manual state management of uploaded items.

## [1.0.1] - 2026-01-11

### Changed
- Remove beta status from documentation and README.
- Optimize package bundling by deduping `react` and `react-dom` in Vite config (#3).

## [1.0.0] - 2024-12-15

### Added
- Full production release.
- Integration with Vercel adapter and analytics.
- Comprehensive file upload examples and playground.
- GitHub Actions workflow for automated releases.
- Mobile navigation for documentation.

### Changed
- Replaced Astro with React for documentation site for better component reuse.
- Significant improvements to README and API documentation.
- Extracted postbuild scripts for better maintenance.

## [1.0.0-beta.1] - 2024-12-15

### Added
- Initial beta release.
- Core `uplofile` component implementation.
- Basic documentation and installation instructions.

## [0.1.0] - 2024-08-10

### Added
- Initial setup and project structure.
- Basic file upload functionality.
