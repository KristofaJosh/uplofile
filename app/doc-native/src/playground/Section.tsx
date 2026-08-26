import React, { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function Section({ title, description, children }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {description ? <Text style={styles.note}>{description}</Text> : null}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  heading: { fontSize: 20, fontWeight: "700" },
  note: { fontSize: 12, color: "#666", lineHeight: 18 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
  },
});
