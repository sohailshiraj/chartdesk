"use client";

export type SplitMode = "ranges" | "fixed";

interface SplitModeSelectorProps {
  mode: SplitMode;
  onChange: (mode: SplitMode) => void;
}

export function SplitModeSelector({ mode, onChange }: SplitModeSelectorProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 w-fit gap-1">
      {(["ranges", "fixed"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === m
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {m === "ranges" ? "Page Ranges" : "Fixed Count"}
        </button>
      ))}
    </div>
  );
}
