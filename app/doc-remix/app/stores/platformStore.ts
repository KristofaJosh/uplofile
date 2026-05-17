import { create } from "zustand";

type Platform = "web" | "react-native";

interface PlatformState {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  platform: "web",
  setPlatform: (platform) => set({ platform }),
}));
