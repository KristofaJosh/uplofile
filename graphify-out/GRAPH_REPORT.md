# Graph Report - .  (2026-07-31)

## Corpus Check
- Corpus is ~37,112 words - fits in a single context window. You may not need a graph.

## Summary
- 803 nodes · 1180 edges · 95 communities (54 shown, 41 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.86)
- Token cost: 12,094 input · 9,909 output

## Community Hubs (Navigation)
- src index ts
- CodeBlock tsx
- doc native package json
- bunchee
- Backend and Protocol Agnosticism
- doc remix package json
- toast tsx
- doc remix tsconfig json
- App
- package json
- uplofile tsconfig json
- FeatureCard tsx
- components json
- lib utils ts
- PlatformTabs tsx
- formatBytes
- mockUpload
- ExamplePage
- uplofile package json
- keywords
- expo
- loadingstate tsx
- ClientOnly tsx
- mockOnRemove
- beforeuploadvalidation tsx
- dependencies
- peerDependenciesMeta
- scripts
- Cancel Control
- avataruploader tsx
- Client Side Routing
- Cancel Control
- Cancel Control
- Cancel Control
- doc native tsconfig json
- rootimperative tsx
- React Router Brand
- Cancel Control
- Cancel Control
- exports
- postbuild cjs
- metro config js
- basic upload spec ts
- multiple uploads spec ts
- sonner tsx
- welcome tsx
- dropzone spec ts
- file actions spec ts
- form integration spec ts
- root imperative spec ts
- validation spec ts
- dependencies
- repository
- class variance authority
- clsx
- dnd kit core
- dnd kit sortable
- next themes
- prism react renderer
- radix ui react accordion
- radix ui react slot
- radix ui react toast
- radix ui react tooltip
- react
- react icons
- react router
- react router node
- react router serve
- sonner
- tailwind merge
- tailwindcss animate
- uplofile
- vercel analytics
- vercel react router
- vite plugin svgr
- vite tsconfig paths
- zustand
- vercel json
- vite config ts
- Bug Report Template
- Feature Request Template
- Project Sponsorship Channels

## God Nodes (most connected - your core abstractions)
1. `react` - 34 edges
2. `mockUpload()` - 21 edges
3. `useUplofile()` - 17 edges
4. `compilerOptions` - 16 edges
5. `keywords` - 14 edges
6. `compilerOptions` - 14 edges
7. `CodeBlock()` - 13 edges
8. `DocsLayout()` - 13 edges
9. `ExamplePage()` - 13 edges
10. `cn()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Uploads as Infrastructure Concerns` --semantically_similar_to--> `Bring Your Own Upload Logic`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Accessible Unstyled Upload Primitives` --semantically_similar_to--> `Accessible Unstyled Preview`  [INFERRED] [semantically similar]
  packages/uplofile/README.md → CHANGELOG.md
- `Create a GitHub Pull Request` --references--> `Pull Request Template`  [INFERRED]
  .agents/skills/gh-create-pr/SKILL.md → .github/PULL_REQUEST_TEMPLATE.md
- `Dependency Security Overrides` --conceptually_related_to--> `Continuous Integration Workflow`  [INFERRED]
  pnpm-workspace.yaml → .github/workflows/ci.yml
- `End-to-End Test Job` --references--> `Upload Test Fixture`  [INFERRED]
  .github/workflows/ci.yml → app/doc-remix/e2e/fixtures/test.txt

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Uplofile Documentation Surface** — readme_uplofile, packages_uplofile_readme_package_readme, app_doc_remix_public_llms_uplofile_agent_reference [EXTRACTED 1.00]
- **Cross-Platform Upload Architecture** — agents_cross_platform_architecture, changelog_platform_agnostic_state_hook, changelog_react_native_support, app_doc_remix_public_llms_composable_upload_primitives [INFERRED 0.85]
- **Repository Quality Process** — github_pull_request_template_verification_checklist, github_workflows_ci_unit_tests, github_workflows_ci_e2e_tests, contributing_contribution_workflow [INFERRED 0.85]
- **Uplofile Icon Upload Flow** — app_doc_remix_app_assets_icon_upload_arrow, app_doc_remix_app_assets_icon_progress_bar, app_doc_remix_app_assets_icon_cancel_control [INFERRED 0.85]
- **React Router Dark Brand Lockup** — app_doc_remix_app_welcome_logo_dark_react_router_brand, app_doc_remix_app_welcome_logo_dark_react_wordmark, app_doc_remix_app_welcome_logo_dark_router_wordmark, app_doc_remix_app_welcome_logo_dark_route_network_symbol [EXTRACTED 1.00]
- **React Router Light Logo Composition** — app_doc_remix_app_welcome_logo_light_route_mark, app_doc_remix_app_welcome_logo_light_react_wordmark, app_doc_remix_app_welcome_logo_light_router_wordmark [EXTRACTED 1.00]
- **Upload Status Interface** — app_doc_remix_public_apple_touch_icon_upload_panel, app_doc_remix_public_apple_touch_icon_upload_action, app_doc_remix_public_apple_touch_icon_transfer_progress, app_doc_remix_public_apple_touch_icon_cancel_control [EXTRACTED 1.00]
- **Uplofile Favicon Upload Flow** — app_doc_remix_public_favicon_96x96_upload_arrow, app_doc_remix_public_favicon_96x96_progress_indicator, app_doc_remix_public_favicon_96x96_cancel_control [INFERRED 0.85]
- **Favicon Upload Status Interface** — app_doc_remix_public_favicon_upload_panel, app_doc_remix_public_favicon_upload_action, app_doc_remix_public_favicon_transfer_progress, app_doc_remix_public_favicon_cancel_control, app_doc_remix_public_favicon_file_metadata_line [EXTRACTED 1.00]
- **Uplofile Manifest Icon Upload Flow** — app_doc_remix_public_web_app_manifest_192x192_upload_arrow, app_doc_remix_public_web_app_manifest_192x192_progress_bar, app_doc_remix_public_web_app_manifest_192x192_cancel_control [INFERRED 0.85]
- **Manifest Upload Status Interface** — app_doc_remix_public_web_app_manifest_512x512_upload_panel, app_doc_remix_public_web_app_manifest_512x512_upload_action, app_doc_remix_public_web_app_manifest_512x512_transfer_progress, app_doc_remix_public_web_app_manifest_512x512_cancel_control, app_doc_remix_public_web_app_manifest_512x512_file_metadata_line [EXTRACTED 1.00]

## Communities (95 total, 41 thin omitted)

### Community 0 - "src index ts"
Cohesion: 0.06
Nodes (54): Preview(), Props, styles, Root, NativeTriggerProps, Trigger(), ItemsCtx, StableCtx (+46 more)

### Community 1 - "CodeBlock tsx"
Cohesion: 0.06
Nodes (24): CodeBlock(), CodeBlockProps, DocsLayout(), DocsSidebar(), sidebarItems, ExamplePageProps, faqItems, FAQSection() (+16 more)

### Community 2 - "doc native package json"
Cohesion: 0.06
Nodes (35): dependencies, expo, expo-dev-client, expo-document-picker, expo-status-bar, react, react-native, @react-native-documents/picker (+27 more)

### Community 3 - "bunchee"
Cohesion: 0.06
Nodes (34): bunchee, jsdom, devDependencies, bunchee, jsdom, prettier, react, react-dom (+26 more)

### Community 4 - "Backend and Protocol Agnosticism"
Cohesion: 0.07
Nodes (33): Backend and Protocol Agnosticism, Bring Your Own Upload Logic, Conventional Commit Release Policy, Shared Web and Native Architecture, PR Authorization Boundaries, Create a GitHub Pull Request, Draft-First Pull Request Review, Uplofile Agent Guide (+25 more)

### Community 5 - "doc remix package json"
Cohesion: 0.06
Nodes (30): devDependencies, @playwright/test, @react-router/dev, tailwindcss, @tailwindcss/typography, @tailwindcss/vite, @types/node, @types/react (+22 more)

### Community 6 - "toast tsx"
Cohesion: 0.12
Nodes (24): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+16 more)

### Community 7 - "doc remix tsconfig json"
Cohesion: 0.08
Nodes (26): compilerOptions, allowImportingTsExtensions, esModuleInterop, jsx, lib, module, moduleResolution, noEmit (+18 more)

### Community 8 - "App"
Cohesion: 0.13
Nodes (12): App(), mockUpload(), BasicUpload(), styles, BatchUpload(), styles, PreviewGallery(), styles (+4 more)

### Community 9 - "package json"
Cohesion: 0.11
Nodes (18): devDependencies, prettier, semantic-release, @semantic-release/changelog, @semantic-release/git, prettier, name, packageManager (+10 more)

### Community 10 - "uplofile tsconfig json"
Cohesion: 0.11
Nodes (18): compilerOptions, composite, declaration, declarationMap, emitDeclarationOnly, esModuleInterop, jsx, lib (+10 more)

### Community 11 - "FeatureCard tsx"
Cohesion: 0.15
Nodes (5): FeatureCard(), Props, FeaturesSection(), BasicUploaderDemo(), DropzoneUploaderDemo()

### Community 12 - "components json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 14 - "lib utils ts"
Cohesion: 0.20
Nodes (7): clearMockResumableCheckpoint(), fileFingerprint(), mockResumableUpload(), mockResumableUploadCheckpoints, ActionButtons(), clearCheckpointForItem(), PauseResumeResumableDemo()

### Community 15 - "PlatformTabs tsx"
Cohesion: 0.21
Nodes (9): Platform, platformIcons, platformLabels, PlatformTabs(), PlatformTabsProps, Installation(), Platform, PlatformState (+1 more)

### Community 16 - "formatBytes"
Cohesion: 0.20
Nodes (6): formatBytes(), FileItem(), FileListWithActionsDemo(), getFileIcon(), VideoItem(), VideoUploaderDemo()

### Community 17 - "mockUpload"
Cohesion: 0.18
Nodes (4): mockUpload(), BatchStatus, BatchUploadDemo(), mockBatchUpload()

### Community 18 - "ExamplePage"
Cohesion: 0.18
Nodes (3): ExamplePage(), FormIntegrationDemo(), ImageGalleryDemo()

### Community 19 - "uplofile package json"
Cohesion: 0.15
Nodes (12): author, description, files, homepage, license, main, name, sideEffects (+4 more)

### Community 20 - "keywords"
Cohesion: 0.15
Nodes (13): keywords, composable, drag-and-drop, dropzone, file, file upload, file uploader, form (+5 more)

### Community 21 - "expo"
Cohesion: 0.17
Nodes (11): expo, ios, name, platforms, plugins, slug, version, bundleIdentifier (+3 more)

### Community 22 - "loadingstate tsx"
Cohesion: 0.26
Nodes (6): LoadingStateDeclarativeDemo(), loadInitial(), LoadingStateFormDemo(), loadInitial(), LoadingStateImperativeDemo(), loadInitial()

### Community 24 - "mockOnRemove"
Cohesion: 0.32
Nodes (3): mockOnRemove(), DefaultPreviewCustomDemo(), DefaultPreviewStyledDemo()

### Community 26 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, @dnd-kit/utilities, isbot, react-dom, react-dom, @dnd-kit/utilities, isbot

### Community 27 - "peerDependenciesMeta"
Cohesion: 0.29
Nodes (7): peerDependenciesMeta, react-dom, react-native, @react-native-documents/picker, optional, optional, optional

### Community 28 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, clean, format, prepare, prepublishOnly, test

### Community 29 - "Cancel Control"
Cohesion: 0.47
Nodes (6): Cancel Control, Upload Progress Bar, Secondary Status Baseline, Upload Arrow, Upload Lifecycle, Uplofile Upload Icon

### Community 32 - "Client Side Routing"
Cohesion: 0.40
Nodes (6): Client-Side Routing, Light Theme Branding, React Router Logo, React Wordmark, Connected Route Mark, Router Wordmark

### Community 33 - "Cancel Control"
Cohesion: 0.47
Nodes (6): Cancel Control, File Metadata Line, Transfer Progress, Upload Action, Upload Interface Favicon, Upload Panel

### Community 34 - "Cancel Control"
Cohesion: 0.47
Nodes (6): Cancel Control, Upload Progress Bar, Status Baseline, Upload Arrow, Upload Lifecycle, Uplofile App Icon

### Community 35 - "Cancel Control"
Cohesion: 0.47
Nodes (6): Cancel Control, File Metadata Line, Transfer Progress, Upload Action, Upload Interface App Icon, Upload Panel

### Community 36 - "doc native tsconfig json"
Cohesion: 0.40
Nodes (4): compilerOptions, strict, extends, expo/tsconfig.base

### Community 38 - "React Router Brand"
Cohesion: 0.50
Nodes (5): React Router Brand, React Router Dark Logo, React Wordmark, Route Network Symbol, Router Wordmark

### Community 39 - "Cancel Control"
Cohesion: 0.60
Nodes (5): Cancel Control, Transfer Progress, Upload Action, Upload Interface Icon, Upload Panel

### Community 40 - "Cancel Control"
Cohesion: 0.50
Nodes (5): Cancel Control, Upload Progress Indicator, Upload Arrow, Upload Lifecycle, Uplofile Favicon

### Community 41 - "exports"
Cohesion: 0.40
Nodes (5): exports, ./native, default, react-native, types

### Community 42 - "postbuild cjs"
Cohesion: 0.40
Nodes (4): content, dtsPath, fs, path

### Community 43 - "metro config js"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, path

### Community 45 - "multiple uploads spec ts"
Cohesion: 0.50
Nodes (3): __dirname, fixturesDir, testFile

### Community 53 - "dependencies"
Cohesion: 0.67
Nodes (3): dependencies, @radix-ui/react-slot, @radix-ui/react-slot

### Community 54 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **284 isolated node(s):** `name`, `slug`, `version`, `ios`, `android` (+279 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `CodeBlock tsx` to `src index ts`, `rootimperative tsx`, `toast tsx`, `App`, `FeatureCard tsx`, `mockUpload`, `keywords`, `loadingstate tsx`, `ClientOnly tsx`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `CodeBlock tsx`, `uplofile package json`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `bunchee` to `uplofile package json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _284 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src index ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06452455590386624 - nodes in this community are weakly interconnected._
- **Should `CodeBlock tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06093189964157706 - nodes in this community are weakly interconnected._
- **Should `doc native package json` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._