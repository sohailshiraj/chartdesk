"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Spinner } from "@/components/ui/Spinner";
import { PatientNameList } from "@/components/namestamp/PatientNameList";
import { StampSettings } from "@/components/namestamp/StampSettings";
import { Corner, stampPdfBatch } from "@/lib/pdf-stamp";
import { downloadAsZip } from "@/lib/download";
import Link from "next/link";

export default function NameStampPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [names, setNames] = useState<string[]>([""]);
  const [corner, setCorner] = useState<Corner>("top-right");
  const [fontSize, setFontSize] = useState(12);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setStatus("idle");
    const bytes = await f.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setTotalPages(doc.getPageCount());
  }, []);

  const validNames = names.filter((n) => n.trim().length > 0);
  const canStamp = file && totalPages > 0 && validNames.length > 0 && status !== "processing";

  const handleStamp = async () => {
    if (!file) return;
    if (validNames.length === 0) {
      setErrorMsg("Please add at least one patient name.");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setErrorMsg("");
    try {
      const bytes = await file.arrayBuffer();
      const results = await stampPdfBatch(bytes, validNames, corner, fontSize);
      await downloadAsZip(results, "namestamp-output.zip");
      setStatus("done");
    } catch (e) {
      console.error(e);
      setErrorMsg("Something went wrong while stamping. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to ChartDesk
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <svg className="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NameStamp</h1>
              <p className="text-sm text-gray-500">Stamp patient names on every page of a chart template</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Upload */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              1 — Upload Chart Template PDF
            </h2>
            <FileDropzone onFile={handleFile} file={file} label="Drop your chart template PDF here" />
            {totalPages > 0 && (
              <p className="mt-3 text-sm text-gray-600">
                <span className="font-medium text-violet-700">{totalPages}</span> page{totalPages !== 1 ? "s" : ""} detected — name will be stamped on all pages
              </p>
            )}
          </div>

          {/* Step 2: Patient names */}
          {file && totalPages > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                2 — Patient Names
              </h2>
              <PatientNameList names={names} onChange={setNames} />
              {validNames.length > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  {validNames.length} PDF{validNames.length !== 1 ? "s" : ""} will be generated
                </p>
              )}
            </div>
          )}

          {/* Step 3: Settings */}
          {file && totalPages > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                3 — Stamp Settings
              </h2>
              <StampSettings
                corner={corner}
                fontSize={fontSize}
                onCornerChange={setCorner}
                onFontSizeChange={setFontSize}
              />
            </div>
          )}

          {/* Step 4: Action */}
          {file && totalPages > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                4 — Stamp & Download
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
                  Done! {validNames.length} stamped PDF{validNames.length !== 1 ? "s" : ""} downloaded as ZIP.
                </div>
              )}

              <button
                onClick={handleStamp}
                disabled={!canStamp}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === "processing" ? (
                  <>
                    <Spinner className="h-4 w-4 text-white" />
                    Stamping {validNames.length} PDF{validNames.length !== 1 ? "s" : ""}...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Stamp & Download ZIP
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
