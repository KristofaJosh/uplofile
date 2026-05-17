import { usePlatformStore } from "@/stores/platformStore";

type Platform = "web" | "react-native";

interface PlatformTabsProps {
  className?: string;
}

const platformLabels: Record<Platform, string> = {
  web: "Web",
  "react-native": "React Native",
};

const platformIcons: Record<Platform, string> = {
  web: "🌐",
  "react-native": "📱",
};

export const PlatformTabs = ({ className = "" }: PlatformTabsProps) => {
  const { platform, setPlatform } = usePlatformStore();

  return (
    <div className={`flex border border-border rounded-lg p-1 ${className}`}>
      {(Object.keys(platformLabels) as Platform[]).map((p) => (
        <button
          key={p}
          onClick={() => setPlatform(p)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            platform === p
              ? "bg-background text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>{platformIcons[p]}</span>
          <span>{platformLabels[p]}</span>
        </button>
      ))}
    </div>
  );
};
