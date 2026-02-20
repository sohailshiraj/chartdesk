import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type Corner = "top-left" | "top-right";

export interface StampResult {
  name: string;
  bytes: Uint8Array;
}

const MARGIN = 20; // points from edge

export async function stampPdf(
  pdfBytes: ArrayBuffer,
  patientName: string,
  corner: Corner,
  fontSize: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const textWidth = font.widthOfTextAtSize(patientName, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    let x: number;
    const y = height - MARGIN - textHeight;

    if (corner === "top-right") {
      x = width - textWidth - MARGIN;
    } else {
      x = MARGIN;
    }

    page.drawText(patientName, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return doc.save();
}

export async function stampPdfBatch(
  pdfBytes: ArrayBuffer,
  patients: string[],
  corner: Corner,
  fontSize: number
): Promise<StampResult[]> {
  const results: StampResult[] = [];
  for (const name of patients) {
    const bytes = await stampPdf(pdfBytes, name, corner, fontSize);
    results.push({ name, bytes });
  }
  return results;
}
