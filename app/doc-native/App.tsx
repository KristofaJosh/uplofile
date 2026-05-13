import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView } from "react-native";
import { QuickStart } from "./src/playground/QuickStart";
import { BasicUpload } from "./src/playground/BasicUpload";
import { PreviewGallery } from "./src/playground/PreviewGallery";
import { WithValidation } from "./src/playground/WithValidation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 32 }}>
        <QuickStart />
        <BasicUpload />
        <PreviewGallery />
        <WithValidation />
      </ScrollView>
    </SafeAreaView>
  );
}
