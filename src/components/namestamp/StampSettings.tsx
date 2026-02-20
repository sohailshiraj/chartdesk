"use client";

import { Corner } from "@/lib/pdf-stamp";

interface StampSettingsProps {
  corner: Corner;
  fontSize: number;
  onCornerChange: (c: Corner) => void;
  onFontSizeChange: (size: number) => void;
}

export function StampSettings({
  corner,
  fontSize,
  onCornerChange,
  onFontSizeChange,
}: StampSettingsProps) {
  return (
    <div className="flex flex-wrap gap-6 items-center">
      {/* Corner selector */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-500">Corner</p>
        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 gap-1">
          {(["top-left", "top-right"] as const).map((c) => (
            <button
              key={c}
              onClick={() => onCornerChange(c)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                corner === c
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {c === "top-left" ? "Top Left" : "Top Right"}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-500">Font Size</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={fontSize}
            min={6}
            max={36}
            onChange={(e) => onFontSizeChange(Math.max(6, Math.min(36, Number(e.target.value))))}
            className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
          />
          <span className="text-sm text-gray-500">pt</span>
        </div>
      </div>
    </div>
  );
}
