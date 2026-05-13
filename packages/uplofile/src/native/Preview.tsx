import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useUplofile } from "../shared/hook";
import type { PreviewRenderProps, UploadFileItem } from "../shared/types";

type Props<TMeta = any> = {
  render?: (api: PreviewRenderProps<TMeta>) => React.ReactNode;
};

export const Preview = <TMeta = any,>({ render }: Props<TMeta>) => {
  const { items, actions, setItems, isLoading } = useUplofile<TMeta>();

  if (render && typeof render === "function") {
    return render({
      items,
      setItems,
      actions,
      isLoading,
    }) as React.ReactElement;
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <PreviewItem key={item.uid} item={item} actions={actions} />
      ))}
    </View>
  );
};

const PreviewItem = ({
  item,
  actions,
}: {
  item: UploadFileItem;
  actions: PreviewRenderProps["actions"];
}) => {
  const sourceUri = item.url || item.previewUrl;

  return (
    <View style={styles.item} key={item.uid}>
      {item.status === "error" && <Text style={styles.errorBadge}>!</Text>}

      {sourceUri ? (
        <Image
          source={{ uri: sourceUri }}
          style={styles.media}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text>{item.name.split(".").pop() || ""}</Text>
        </View>
      )}

      {item.status === "uploading" && (
        <View style={styles.overlay}>
          <Text style={styles.progressText}>{item.progress ?? 0}%</Text>
        </View>
      )}

      <View style={styles.actions}>
        {item.status === "uploading" && (
          <TouchableOpacity
            onPress={() => actions.cancel(item.uid)}
            style={styles.actionButton}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}
        {(item.status === "error" || item.status === "canceled") && (
          <TouchableOpacity
            onPress={() => actions.retry(item.uid)}
            style={styles.actionButton}
          >
            <Text>Retry</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => actions.remove(item.uid)}
          style={styles.actionButton}
        >
          <Text>Remove</Text>
        </TouchableOpacity>
      </View>

      {item.status === "error" && item.error && (
        <Text style={styles.errorText}>{item.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  item: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  media: { width: "100%", height: "100%" },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  progressText: { color: "#fff", fontWeight: "bold" },
  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
  },
  actionButton: { paddingHorizontal: 6, paddingVertical: 2 },
  errorBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: "center",
    lineHeight: 20,
    zIndex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 10,
    position: "absolute",
    bottom: 28,
    left: 4,
  },
});
