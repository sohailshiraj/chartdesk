# Chart Desk

A browser-based PDF utility toolkit. All processing happens locally — no files are uploaded to any server.

Built with Next.js, TypeScript, and Tailwind CSS.

## Tools

### Doc Split
Split a merged multi-page PDF into individual files.

- Upload a single merged PDF
- Define splits by **page ranges** (e.g. Patient A: pages 1–5, Patient B: pages 6–8) or **fixed page count** (e.g. every 3 pages = one file)
- Optionally name each output file
- Download all split files as a ZIP

### Name Stamp
Stamp patient information onto every page of a chart template PDF.

- Upload a blank chart template PDF
- Add one patient per text block (name, ID, DOB, address — anything multi-line)
- Choose corner placement: top-right (default) or top-left
- Adjust font size
- Generates one stamped PDF per patient, downloaded as a ZIP
- Info is stamped inside a bordered box, close to the page corner

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS
- [pdf-lib](https://pdf-lib.js.org) — PDF manipulation
- [JSZip](https://stuk.github.io/jszip) — ZIP file generation
- [react-dropzone](https://react-dropzone.js.org) — file upload

## Deployment

Deployed on [Vercel](https://vercel.com). Connect the repo and it deploys automatically with no configuration needed.
