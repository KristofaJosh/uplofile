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

async function putToS3(file: { uri: string; fileName?: string | null }) {
  const body = new FormData();
  body.append("file", {
    uri: file.uri,
    name: file.fileName ?? "upload",
  } as unknown as Blob);
  const response = await fetch("/api/upload", { method: "POST", body });
  if (!response.ok) throw new Error("Upload failed");
  return response.json(); // { url, id?, meta?, previewUrl? }
}

export function Uploader() {
  return (
    <Root upload={putToS3} pickFiles={pickFiles}>
      <Trigger>Choose photo</Trigger>
      <Preview />
    </Root>
  );
}
