import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type Corner = "top-left" | "top-right";

export interface StampResult {
  name: string;
  bytes: Uint8Array;
}

const MARGIN = 8;     // points from page edge to box edge
const PADDING = 5;    // points inside box around text
const LINE_GAP = 3;   // extra points between lines

export async function stampPdf(
  pdfBytes: ArrayBuffer,
  patientInfo: string,
  corner: Corner,
  fontSize: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  const lines = patientInfo.split("\n").map((l) => l.trimEnd());
  const lineHeight = fontSize + LINE_GAP;
  const textHeight = lines.length * lineHeight - LINE_GAP; // no trailing gap

  const maxLineWidth = Math.max(...lines.map((l) => font.widthOfTextAtSize(l, fontSize)));
  const boxWidth = maxLineWidth + PADDING * 2;
  const boxHeight = textHeight + PADDING * 2;

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();

    const boxX = corner === "top-right" ? width - boxWidth - MARGIN : MARGIN;
    const boxY = height - MARGIN - boxHeight;

    // Border box with white fill
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      color: rgb(1, 1, 1),
    });

    // Draw each line top-to-bottom
    lines.forEach((line, i) => {
      const lineY = boxY + boxHeight - PADDING - fontSize - i * lineHeight;
      page.drawText(line, {
        x: boxX + PADDING,
        y: lineY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
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
  for (const info of patients) {
    // Use the first non-empty line as the filename
    const name = info.split("\n").find((l) => l.trim().length > 0)?.trim() ?? `Patient ${results.length + 1}`;
    const bytes = await stampPdf(pdfBytes, info, corner, fontSize);
    results.push({ name, bytes });
  }
  return results;
}
