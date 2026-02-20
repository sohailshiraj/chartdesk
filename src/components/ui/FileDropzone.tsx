"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  onFile: (file: File) => void;
  file: File | null;
  label?: string;
}

export function FileDropzone({
  onFile,
  file,
  label = "Drop your PDF here, or click to select",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors
        ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}`}
    >
      <input {...getInputProps()} />
      <svg
        className="mb-3 h-10 w-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {file ? (
        <div className="text-center">
          <p className="text-sm font-medium text-indigo-700">{file.name}</p>
          <p className="text-xs text-gray-500 mt-1">Click or drop to replace</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">PDF files only</p>
        </div>
      )}
    </div>
  );
}
