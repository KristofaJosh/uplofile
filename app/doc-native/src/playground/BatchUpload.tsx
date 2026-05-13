import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Root, Trigger, useUplofile, type UploadResult } from "uplofile/native";

function BatchStatus() {
  const { items } = useUplofile();
  const pending = items.filter((i) => i.status === "uploading");

  return (
    <View style={styles.statusRow}>
      {pending.map((item) => (
        <View key={item.uid} style={styles.fileRow}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileStatus}>
            {item.status === "uploading" ? "waiting" : item.status}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function BatchUpload() {
  const pendingRef = useRef<
    Map<
      any,
      {
        resolve: (r: UploadResult) => void;
        reject: (e: Error) => void;
      }
    >
  >(new Map());
  const [pendingCount, setPendingCount] = useState(0);
  const [batchUploading, setBatchUploading] = useState(false);

  const upload = useCallback(
    (
      file: any,
      signal: AbortSignal,
      _setProgress?: (pct: number) => void,
    ): Promise<UploadResult> => {
      return new Promise((resolve, reject) => {
        pendingRef.current.set(file, { resolve, reject });
        setPendingCount(pendingRef.current.size);

        signal.addEventListener("abort", () => {
          pendingRef.current.delete(file);
          setPendingCount(pendingRef.current.size);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    },
    [],
  );

  const handleBatchUpload = useCallback(async () => {
    if (pendingRef.current.size === 0) return;
    setBatchUploading(true);

    const batch = Array.from(pendingRef.current.entries());
    pendingRef.current.clear();
    setPendingCount(0);

    await new Promise((r) => setTimeout(r, 2000));

    batch.forEach(([file, { resolve }], i) => {
      resolve({
        url: `https://example.com/uploads/${encodeURIComponent(file?.name ?? "file")}`,
        id: `batch-${Date.now()}-${i}`,
      });
    });

    setBatchUploading(false);
  }, []);

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Batch Upload</Text>
      <Text style={styles.description}>
        Files are collected and sent as a single batch request.
      </Text>
      <Root upload={upload}>
        <View style={styles.row}>
          <Trigger>
            <View style={styles.trigger}>
              <Text style={styles.triggerText}>Select Files</Text>
            </View>
          </Trigger>

          {pendingCount > 0 && (
            <TouchableOpacity
              onPress={handleBatchUpload}
              disabled={batchUploading}
              style={[
                styles.batchBtn,
                batchUploading && styles.batchBtnDisabled,
              ]}
            >
              <Text style={styles.batchBtnText}>
                {batchUploading
                  ? "Uploading..."
                  : `Upload All (${pendingCount})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <BatchStatus />
      </Root>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { fontSize: 20, fontWeight: "700" },
  description: { fontSize: 13, color: "#666" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" },
  trigger: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  triggerText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  batchBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  batchBtnDisabled: { opacity: 0.5 },
  batchBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  statusRow: { gap: 8 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 6,
  },
  fileName: { flex: 1, fontSize: 14 },
  fileStatus: {
    fontSize: 12,
    color: "#D97706",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
});
