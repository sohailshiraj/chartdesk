"use client";

import { PageException, Position } from "@/lib/pdf-stamp";

interface PageExceptionsProps {
  exceptions: PageException[];
  ignoredPagesRaw: string;
  totalPages: number;
  onChange: (exceptions: PageException[]) => void;
  onIgnoredPagesChange: (raw: string) => void;
}

const POSITIONS: { value: Position; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-center", label: "Top Center" },
];

export function PageExceptions({
  exceptions,
  ignoredPagesRaw,
  totalPages,
  onChange,
  onIgnoredPagesChange,
}: PageExceptionsProps) {
  const add = () =>
    onChange([...exceptions, { page: 1, position: "top-left" }]);

  const update = (i: number, field: keyof PageException, value: number | Position) => {
    onChange(exceptions.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  };

  const remove = (i: number) => onChange(exceptions.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      {/* Ignore pages */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700">Skip Pages</p>
        <p className="text-xs text-gray-500">
          These pages will not be stamped at all. Enter page numbers separated by commas.
        </p>
        <input
          type="text"
          value={ignoredPagesRaw}
          onChange={(e) => onIgnoredPagesChange(e.target.value)}
          placeholder="e.g. 1, 3, 5"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <hr className="border-gray-100" />

      {/* Position exceptions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Position Exceptions</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Override the stamp position for specific pages.
            </p>
          </div>
          <button
            onClick={add}
            className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        {exceptions.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            No exceptions — default position applies to all pages.
          </p>
        )}

        {exceptions.map((ex, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 shrink-0">Page</span>
            <input
              type="number"
              value={ex.page}
              min={1}
              max={totalPages}
              onChange={(e) =>
                update(i, "page", Math.max(1, Math.min(totalPages, Number(e.target.value))))
              }
              className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
            />
            <span className="text-xs text-gray-500 shrink-0">→</span>
            <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 gap-1">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => update(i, "position", p.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    ex.position === p.value
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => remove(i)}
              className="ml-auto flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
