"use client";

import { Position } from "@/lib/pdf-stamp";

interface StampSettingsProps {
  position: Position;
  fontSize: number;
  onPositionChange: (p: Position) => void;
  onFontSizeChange: (size: number) => void;
}

const POSITIONS: { value: Position; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-center", label: "Top Center" },
];

export function StampSettings({
  position,
  fontSize,
  onPositionChange,
  onFontSizeChange,
}: StampSettingsProps) {
  return (
    <div className="flex flex-wrap gap-6 items-center">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-500">Default Position</p>
        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 gap-1">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPositionChange(p.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                position === p.value
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-500">Font Size</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={fontSize}
            min={6}
            max={36}
            onChange={(e) =>
              onFontSizeChange(Math.max(6, Math.min(36, Number(e.target.value))))
            }
            className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
          />
          <span className="text-sm text-gray-500">pt</span>
        </div>
      </div>
    </div>
  );
}
