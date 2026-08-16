import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Root, Trigger, Preview } from "uplofile/native";
import type { BeforeUploadFn } from "uplofile/native";
import { mockUpload } from "../mockUpload";
import { Section } from "./Section";

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
    <Section
      title="With Validation"
      description="Files over 5MB will be rejected. The picker may not expose file sizes on all platforms, so this may validate silently depending on the device."
    >
      <Root upload={mockUpload} beforeUpload={beforeUpload}>
        <Trigger>
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Select files</Text>
          </View>
        </Trigger>
        <Preview />
      </Root>
    </Section>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: "#AF52DE",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
