"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Spinner } from "@/components/ui/Spinner";
import { SplitModeSelector, SplitMode } from "@/components/docsplit/SplitModeSelector";
import { PageRangesForm } from "@/components/docsplit/PageRangesForm";
import { FixedCountForm } from "@/components/docsplit/FixedCountForm";
import { SplitEntry, splitPdf, buildEntriesFromFixedCount } from "@/lib/pdf-split";
import { downloadAsZip } from "@/lib/download";
import Link from "next/link";

export default function DocSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState<SplitMode>("ranges");
  const [entries, setEntries] = useState<SplitEntry[]>([
    { name: "Patient 1", startPage: 1, endPage: 1 },
  ]);
  const [pagesPerPatient, setPagesPerPatient] = useState(1);
  const [fixedNames, setFixedNames] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setStatus("idle");
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const count = doc.getPageCount();
    setTotalPages(count);
    setEntries([{ name: "Patient 1", startPage: 1, endPage: count }]);
    setPagesPerPatient(1);
    setFixedNames([]);
  }, []);

  const validate = (): string | null => {
    if (mode === "ranges") {
      for (const e of entries) {
        if (!e.name.trim()) return "All patients must have a name.";
        if (e.startPage < 1 || e.endPage > totalPages || e.endPage < e.startPage)
          return `Invalid page range for "${e.name}".`;
      }
    } else {
      if (pagesPerPatient < 1) return "Pages per patient must be at least 1.";
    }
    return null;
  };

  const handleSplit = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); setStatus("error"); return; }
    if (!file) return;

    setStatus("processing");
    setErrorMsg("");
    try {
      const bytes = await file.arrayBuffer();
      const finalEntries =
        mode === "ranges"
          ? entries
          : buildEntriesFromFixedCount(totalPages, pagesPerPatient, fixedNames);
      const results = await splitPdf(bytes, finalEntries);
      await downloadAsZip(results, "docsplit-output.zip");
      setStatus("done");
    } catch (e) {
      console.error(e);
      setErrorMsg("Something went wrong while splitting. Please try again.");
      setStatus("error");
    }
  };

  const canSplit = file && totalPages > 0 && status !== "processing";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Chart Desk
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doc Split</h1>
              <p className="text-sm text-gray-500">Split a merged PDF into individual files</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Upload */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              1 — Upload Merged PDF
            </h2>
            <FileDropzone onFile={handleFile} file={file} />
            {totalPages > 0 && (
              <p className="mt-3 text-sm text-gray-600">
                <span className="font-medium text-indigo-700">{totalPages}</span> pages detected
              </p>
            )}
          </div>

          {/* Step 2: Split settings */}
          {file && totalPages > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                2 — Define Patient Splits
              </h2>
              <div className="space-y-5">
                <SplitModeSelector mode={mode} onChange={setMode} />
                {mode === "ranges" ? (
                  <PageRangesForm
                    entries={entries}
                    totalPages={totalPages}
                    onChange={setEntries}
                  />
                ) : (
                  <FixedCountForm
                    totalPages={totalPages}
                    pagesPerPatient={pagesPerPatient}
                    names={fixedNames}
                    onPagesPerPatientChange={setPagesPerPatient}
                    onNamesChange={setFixedNames}
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 3: Action */}
          {file && totalPages > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                3 — Split & Download
              </h2>

              {status === "error" && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              {status === "done" && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Done! Your ZIP file has been downloaded.
                </div>
              )}

              <button
                onClick={handleSplit}
                disabled={!canSplit}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === "processing" ? (
                  <>
                    <Spinner className="h-4 w-4 text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Split & Download ZIP
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
