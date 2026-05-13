# doc-native — Uplofile React Native Playground

A single-screen Expo app for developers to test and preview `uplofile/native` during development. Runs on iOS and Android simulators/devices with Fast Refresh across the workspace.

---

## Stack

- **Expo SDK 52+**
- **React Native 0.76+**
- **`expo-document-picker`** (part of Expo ecosystem, no extra native linking)
- **`uplofile: "workspace:*"`** (pnpm workspace link)
- **No Expo Router** — single `App.tsx`, scrollable screen

---

## Files

```
app/doc-native/
├── package.json
├── app.json
├── tsconfig.json
├── metro.config.js            # Watch uplofile package for Fast Refresh
├── App.tsx                    # Single entry, scrollable sections
└── src/
    ├── mockUpload.ts          # Simulated upload with progress
    └── playground/
        ├── QuickStart.tsx     # Minimal Root + Trigger + Preview
        ├── BasicUpload.tsx    # Full lifecycle with actions
        ├── PreviewGallery.tsx # Image grid, error states, render prop
        └── WithValidation.tsx # beforeUpload filtering
```

---

## Key files

### `package.json`

```json
{
  "name": "doc-native",
  "private": true,
  "version": "0.1.0",
  "main": "App.tsx",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-document-picker": "~12.0.0",
    "react": "^19.0.0",
    "react-native": "~0.76.0",
    "uplofile": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "^5.3.0"
  }
}
```

### `app.json`

```json
{
  "expo": {
    "name": "Uplofile Native",
    "slug": "doc-native",
    "version": "0.1.0",
    "platforms": ["ios", "android"],
    "plugins": ["expo-document-picker"]
  }
}
```

### `metro.config.js`

Enables Fast Refresh when editing `packages/uplofile/src/native/`:

```js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, "../../packages/uplofile")];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];

module.exports = config;
```

### `App.tsx`

```tsx
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView } from "react-native";
import { QuickStart } from "./src/playground/QuickStart";
import { BasicUpload } from "./src/playground/BasicUpload";
import { PreviewGallery } from "./src/playground/PreviewGallery";
import { WithValidation } from "./src/playground/WithValidation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
        <QuickStart />
        <BasicUpload />
        <PreviewGallery />
        <WithValidation />
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## Playground sections

Each is a self-contained `React.FC` that imports directly from `uplofile/native`.

### `QuickStart.tsx`

- Single `<Root>` with one `<Trigger>` and `<Preview>`
- `upload` function simulates a delay with progress
- Purpose: verify library mounts, picker opens, items appear

### `BasicUpload.tsx`

- Upload with `setProgress` ticks
- Action buttons: Cancel (during upload), Retry (on error), Remove (on done)
- Purpose: test full status lifecycle (`idle → uploading → done | error | canceled → removed`)

### `PreviewGallery.tsx`

- Multiple files, mixed statuses
- Custom `render` prop on `<Preview>` for thumbnail grid
- Purpose: test visual rendering, error badges, progress overlays

### `WithValidation.tsx`

- `beforeUpload` rejecting files over 5MB
- Shows validation error messages in the UI
- Purpose: test `beforeUpload` in RN context

---

## How to run

```bash
# Monorepo root
pnpm install

# Start Expo
pnpm --filter doc-native start

# Or directly
pnpm --filter doc-native ios
pnpm --filter doc-native android
```

Edit `packages/uplofile/src/native/*.tsx` → changes appear via Fast Refresh in the simulator. Rebuild the library only when changing `src/shared/` or `src/web/`.

---

## Developer workflow

1. Make changes to `packages/uplofile/src/native/*.tsx`
2. Simulator auto-refreshes (metro watches the workspace)
3. Verify in the playground section that exercises that code path
4. Iterate

---

## What's excluded (v0)

| Item | Rationale |
|---|---|
| Expo Router / multi-screen | Not needed for a dev playground |
| Theming, dark mode | Distracts from testing |
| CI / EAS Build | Devs run locally |
| Automated RN tests | No infra in repo yet |
| Styled components / shadcn | RN uses StyleSheet — examples match what users will write |

---

## Future: web embed

Possible approaches to show the RN playground inside the Remix docs:

1. **Expo Snack `iframe`** — embed code snippets at `https://snack.expo.dev/...`
2. **Expo web export** — run `npx expo export:web` and render the output in an `<iframe>` with a mobile frame UI
3. **React Native Web** — would require rewriting native components for RNW compatibility (not recommended for this project)
