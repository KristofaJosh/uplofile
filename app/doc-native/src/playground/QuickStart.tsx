import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Root, Trigger, Preview } from "uplofile/native";
import { mockUpload } from "../mockUpload";
import { Section } from "./Section";

export function QuickStart() {
  return (
    <Section title="Quick Start">
      <Root upload={mockUpload} multiple={false}>
        <Trigger testID="quickstart-trigger">
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Pick a file</Text>
          </View>
        </Trigger>
        <Preview />
      </Root>
    </Section>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
