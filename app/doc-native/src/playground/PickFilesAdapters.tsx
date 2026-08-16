import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { pick } from "@react-native-documents/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { launchImageLibrary } from "react-native-image-picker";
import {
  Root,
  Trigger,
  Preview,
  adapterReactNativeDocumentsPicker,
  adapterExpoDocumentPicker,
  adapterExpoImagePicker,
  adapterReactNativeImagePicker,
  type PickFilesFn,
} from "uplofile/native";
import { mockUpload } from "../mockUpload";
import { Section } from "./Section";

const ADAPTERS: {
  key: string;
  label: string;
  color: string;
  accept?: string;
  pickFiles: PickFilesFn<any>;
}[] = [
  {
    key: "rn-documents",
    label: "adapterReactNativeDocumentsPicker",
    color: "#AF52DE",
    accept: "image/*",
    pickFiles: adapterReactNativeDocumentsPicker(pick),
  },
  {
    key: "expo-document",
    label: "adapterExpoDocumentPicker",
    color: "#5856D6",
    accept: "image/*",
    pickFiles: adapterExpoDocumentPicker(DocumentPicker.getDocumentAsync),
  },
  {
    key: "expo-image",
    label: "adapterExpoImagePicker",
    color: "#FF2D55",
    pickFiles: async (accept, options) => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      return adapterExpoImagePicker(ImagePicker.launchImageLibraryAsync)(
        accept,
        options,
      );
    },
  },
  {
    key: "rn-image",
    label: "adapterReactNativeImagePicker",
    color: "#FF9500",
    pickFiles: adapterReactNativeImagePicker(launchImageLibrary),
  },
];

function AdapterCard({
  testID,
  label,
  color,
  accept,
  pickFiles,
}: (typeof ADAPTERS)[number] & { testID: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Root
        upload={mockUpload}
        accept={accept}
        multiple
        pickFiles={pickFiles}
      >
        <Trigger testID={testID}>
          <View style={[styles.trigger, { backgroundColor: color }]}>
            <Text style={styles.triggerText}>Select via pickFiles</Text>
          </View>
        </Trigger>
        <Preview />
      </Root>
    </View>
  );
}

export function PickFilesAdapters() {
  return (
    <Section
      title="pickFiles adapters"
      description="Each card wires a different injected picker via the `pickFiles` prop instead of the deprecated built-in fallback — none of these `Root` instances should log a deprecation warning."
    >
      <View style={styles.cards}>
        {ADAPTERS.map(({ key, ...adapter }) => (
          <AdapterCard key={key} testID={`pickfiles-trigger-${key}`} {...adapter} />
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  cards: { gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
  },
  cardLabel: { fontSize: 13, fontWeight: "600", color: "#333" },
  trigger: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
