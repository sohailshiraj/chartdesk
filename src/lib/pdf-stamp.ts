import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type Position = "top-left" | "top-right" | "top-center";

export interface PageException {
  page: number;   // 1-indexed
  position: Position;
}

export interface StampResult {
  name: string;
  bytes: Uint8Array;
}

const MARGIN = 8;    // points from page edge to box edge
const PADDING = 5;   // points inside box around text
const LINE_GAP = 3;  // extra points between lines

function getBoxX(position: Position, pageWidth: number, boxWidth: number): number {
  if (position === "top-right") return pageWidth - boxWidth - MARGIN;
  if (position === "top-center") return (pageWidth - boxWidth) / 2;
  return MARGIN; // top-left
}

export async function stampPdf(
  pdfBytes: ArrayBuffer,
  patientInfo: string,
  defaultPosition: Position,
  fontSize: number,
  exceptions: PageException[] = [],
  ignoredPages: number[] = []
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  const lines = patientInfo.split("\n").map((l) => l.trimEnd());
  const lineHeight = fontSize + LINE_GAP;
  const textHeight = lines.length * lineHeight - LINE_GAP;
  const maxLineWidth = Math.max(...lines.map((l) => font.widthOfTextAtSize(l, fontSize)));
  const boxWidth = maxLineWidth + PADDING * 2;
  const boxHeight = textHeight + PADDING * 2;

  const exceptionMap = new Map(exceptions.map((e) => [e.page, e.position]));
  const ignoredSet = new Set(ignoredPages);

  doc.getPages().forEach((page, i) => {
    const pageNum = i + 1;
    if (ignoredSet.has(pageNum)) return;
    const position = exceptionMap.get(pageNum) ?? defaultPosition;
    const { width, height } = page.getSize();

    const boxX = getBoxX(position, width, boxWidth);
    const boxY = height - MARGIN - boxHeight;

    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      color: rgb(1, 1, 1),
    });

    lines.forEach((line, li) => {
      const lineY = boxY + boxHeight - PADDING - fontSize - li * lineHeight;
      page.drawText(line, {
        x: boxX + PADDING,
        y: lineY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  });

  return doc.save();
}

export async function stampPdfBatch(
  pdfBytes: ArrayBuffer,
  patients: string[],
  defaultPosition: Position,
  fontSize: number,
  exceptions: PageException[] = [],
  ignoredPages: number[] = []
): Promise<StampResult[]> {
  const results: StampResult[] = [];
  for (const info of patients) {
    const name =
      info.split("\n").find((l) => l.trim().length > 0)?.trim() ??
      `Patient ${results.length + 1}`;
    const bytes = await stampPdf(pdfBytes, info, defaultPosition, fontSize, exceptions, ignoredPages);
    results.push({ name, bytes });
  }
  return results;
}
