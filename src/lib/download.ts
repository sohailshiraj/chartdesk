import JSZip from "jszip";

export interface DownloadEntry {
  name: string;
  bytes: Uint8Array;
}

export async function downloadAsZip(
  entries: DownloadEntry[],
  zipName: string
): Promise<void> {
  const zip = new JSZip();
  entries.forEach(({ name, bytes }) => {
    const safeName = name.replace(/[^a-zA-Z0-9_\-. ]/g, "_");
    zip.file(`${safeName}.pdf`, bytes);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
