import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Root, Trigger, Preview } from "uplofile/native";
import type { BeforeUploadFn } from "uplofile/native";
import { mockUpload } from "../mockUpload";

const beforeUpload: BeforeUploadFn = (items) => {
  return items.map((item) => {
    const size = (item.file as any)?.size ?? 0;
    if (size > 5 * 1024 * 1024) {
      return {
        uid: item.uid,
        valid: false,
        reason: "File exceeds 5MB limit",
      };
    }
    return { uid: item.uid, valid: true };
  });
};

export function WithValidation() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>With Validation</Text>
      <Text style={styles.note}>
        Files over 5MB will be rejected. The picker may not expose file sizes
        on all platforms, so this may validate silently depending on the
        device.
      </Text>
      <Root upload={mockUpload} beforeUpload={beforeUpload}>
        <Trigger>
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Select files</Text>
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
  note: { fontSize: 12, color: "#666", lineHeight: 18 },
  trigger: {
    backgroundColor: "#AF52DE",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
