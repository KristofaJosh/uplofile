import { pick } from "@react-native-documents/picker";
import { adapterReactNativeDocumentsPicker } from "uplofile/native";

// Shared picker for the playground screens. uplofile v4 has no built-in
// picker, so every Root gets one through the pickFiles prop.
export const pickFiles = adapterReactNativeDocumentsPicker(pick);
