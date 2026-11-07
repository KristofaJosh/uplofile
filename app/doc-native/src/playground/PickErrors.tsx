import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Root, Trigger, type PickFilesFn } from "uplofile/native";
import { mockUpload } from "../mockUpload";
import { Section } from "./Section";

// Stands in for a picker that fails, e.g. when photo access is denied.
const failingPickFiles: PickFilesFn = async () => {
  throw new Error("Photo library access denied");
};

export function PickErrors() {
  const [error, setError] = useState<string | null>(null);

  return (
    <Section
      title="Picker errors"
      description="This picker always fails. Root passes the error to onPickError instead of dropping it. Cancelling is not an error and never reaches it."
    >
      <Root
        upload={mockUpload}
        pickFiles={failingPickFiles}
        onPickError={(e) =>
          setError(e instanceof Error ? e.message : String(e))
        }
      >
        <Trigger testID="pick-errors-trigger">
          <View style={styles.trigger}>
            <Text style={styles.triggerText}>Open failing picker</Text>
          </View>
        </Trigger>
      </Root>
      {error ? (
        <Text testID="pick-errors-message" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </Section>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { color: "#FF3B30", fontSize: 14 },
});
