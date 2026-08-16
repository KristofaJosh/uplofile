import * as ImagePicker from "expo-image-picker";
import {
  Root,
  Trigger,
  Preview,
  adapterExpoImagePicker,
} from "uplofile/native";

const pickFiles = adapterExpoImagePicker(
  ImagePicker.launchImageLibraryAsync,
);

export function Uploader() {
  return (
    <Root upload={putToS3} pickFiles={pickFiles}>
      <Trigger>Choose photo</Trigger>
      <Preview />
    </Root>
  );
}
