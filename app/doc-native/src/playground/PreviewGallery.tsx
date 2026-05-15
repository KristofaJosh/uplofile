import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Root, Trigger, useUplofile } from "uplofile/native";
import { mockUpload } from "../mockUpload";

function GalleryPreview() {
  const { items, isLoading } = useUplofile();

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (items.length === 0) {
    return <Text style={styles.emptyText}>No files yet</Text>;
  }

  return (
    <ScrollView horizontal style={styles.gallery}>
      {items.map((item) => (
        <View key={item.uid} style={styles.thumb}>
          {item.previewUrl || item.url ? (
            <Image
              source={{ uri: item.previewUrl || item.url }}
              style={styles.thumbImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Text>{item.name?.split(".").pop()}</Text>
            </View>
          )}
          <Text style={styles.thumbStatus}>{item.status}</Text>
          {item.status === "uploading" && (
            <View style={styles.progressOverlay}>
              <Text style={styles.progressText}>{item.progress ?? 0}%</Text>
            </View>
          )}
          {item.status === "error" && item.error && (
            <Text style={styles.errorTag}>{item.error}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

export function PreviewGallery() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Preview Gallery</Text>
      <Root upload={mockUpload}>
        <Trigger>
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Add files</Text>
          </View>
        </Trigger>
        <GalleryPreview />
      </Root>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { fontSize: 20, fontWeight: "700" },
  trigger: {
    backgroundColor: "#FF9500",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loadingText: { color: "#888" },
  emptyText: { color: "#aaa", fontStyle: "italic" },
  gallery: { flexDirection: "row" },
  thumb: {
    width: 100,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  thumbImage: { width: "100%", height: "100%" },
  thumbPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  thumbStatus: {
    position: "absolute",
    top: 4,
    left: 4,
    fontSize: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  progressOverlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  progressText: { color: "#fff", fontWeight: "bold" },
  errorTag: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    fontSize: 9,
    color: "red",
  },
});
