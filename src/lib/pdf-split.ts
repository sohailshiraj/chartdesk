import { PDFDocument } from "pdf-lib";

export interface SplitEntry {
  name: string;
  startPage: number; // 1-indexed
  endPage: number; // 1-indexed, inclusive
}

export interface SplitResult {
  name: string;
  bytes: Uint8Array;
}

export async function splitPdf(
  pdfBytes: ArrayBuffer,
  entries: SplitEntry[]
): Promise<SplitResult[]> {
  const sourceDoc = await PDFDocument.load(pdfBytes);
  const results: SplitResult[] = [];

  for (const entry of entries) {
    const newDoc = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: entry.endPage - entry.startPage + 1 },
      (_, i) => entry.startPage - 1 + i
    );
    const copiedPages = await newDoc.copyPages(sourceDoc, pageIndices);
    copiedPages.forEach((page) => newDoc.addPage(page));
    const bytes = await newDoc.save();
    results.push({ name: entry.name, bytes });
  }

  return results;
}

export function buildEntriesFromFixedCount(
  totalPages: number,
  pagesPerPatient: number,
  names: string[]
): SplitEntry[] {
  const entries: SplitEntry[] = [];
  let page = 1;
  let idx = 0;
  while (page <= totalPages) {
    const end = Math.min(page + pagesPerPatient - 1, totalPages);
    entries.push({
      name: names[idx] || `Patient ${idx + 1}`,
      startPage: page,
      endPage: end,
    });
    page = end + 1;
    idx++;
  }
  return entries;
}
