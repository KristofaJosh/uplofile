import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QuickStart } from "./src/playground/QuickStart";
import { BasicUpload } from "./src/playground/BasicUpload";
import { PreviewGallery } from "./src/playground/PreviewGallery";
import { WithValidation } from "./src/playground/WithValidation";
import { BatchUpload } from "./src/playground/BatchUpload";

export default function App() {
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <View style={{ flex: 1, gap: 32, paddingHorizontal: 8 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <QuickStart />
          <BasicUpload />
          <PreviewGallery />
          <WithValidation />
          <BatchUpload />
        </ScrollView>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
