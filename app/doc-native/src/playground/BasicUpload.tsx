import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Root, Trigger, useUplofile } from "uplofile/native";
import { mockUpload } from "../mockUpload";

function ActionsBar() {
  const { items, actions } = useUplofile();

  const uploading = items.filter((i) => i.status === "uploading");
  const errored = items.filter((i) => i.status === "error");
  const done = items.filter((i) => i.status === "done");

  return (
    <View style={styles.actionsBar}>
      <Text style={styles.barText}>
        Uploading: {uploading.length} | Error: {errored.length} | Done:{" "}
        {done.length}
      </Text>
      {items.map((item) => (
        <View key={item.uid} style={styles.actionRow}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.statusTag}>{item.status}</Text>
          {item.status === "uploading" && (
            <TouchableOpacity
              onPress={() => actions.cancel(item.uid)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {(item.status === "error" || item.status === "canceled") && (
            <TouchableOpacity
              onPress={() => actions.retry(item.uid)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>Retry</Text>
            </TouchableOpacity>
          )}
          {item.status === "done" && (
            <TouchableOpacity
              onPress={() => actions.remove(item.uid)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

export function BasicUpload() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Basic Upload</Text>
      <Root upload={mockUpload}>
        <Trigger>
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Select files</Text>
          </View>
        </Trigger>
        <ActionsBar />
      </Root>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { fontSize: 20, fontWeight: "700" },
  trigger: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  actionsBar: { gap: 8 },
  barText: { fontSize: 13, color: "#555" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  fileName: { flex: 1, fontSize: 14 },
  statusTag: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#eee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionBtn: { backgroundColor: "#FF3B30", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  actionBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
