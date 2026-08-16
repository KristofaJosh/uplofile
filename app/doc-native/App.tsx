import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { QuickStart } from "./src/playground/QuickStart";
import { BasicUpload } from "./src/playground/BasicUpload";
import { PreviewGallery } from "./src/playground/PreviewGallery";
import { WithValidation } from "./src/playground/WithValidation";
import { BatchUpload } from "./src/playground/BatchUpload";
import { PickFilesAdapters } from "./src/playground/PickFilesAdapters";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Uplofile Native</Text>
            <Text style={styles.subtitle}>Development Build</Text>
          </View>
          <QuickStart />
          <BasicUpload />
          <PickFilesAdapters />
          <PreviewGallery />
          <WithValidation />
          <BatchUpload />
        </ScrollView>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F7" },
  content: { gap: 28, paddingHorizontal: 16, paddingVertical: 16 },
  header: { gap: 2, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "800", color: "#000" },
  subtitle: { fontSize: 14, color: "#6B7280" },
});
