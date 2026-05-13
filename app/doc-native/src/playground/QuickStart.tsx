import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Root, Trigger, Preview } from "uplofile/native";
import { mockUpload } from "../mockUpload";

export function QuickStart() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Quick Start</Text>
      <Root upload={mockUpload} multiple={false}>
        <Trigger>
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Pick a file</Text>
          </View>
        </Trigger>
        <Preview />
      </Root>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { fontSize: 20, fontWeight: "700" },
  trigger: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
