"use client";

import { SplitEntry } from "@/lib/pdf-split";

interface PageRangesFormProps {
  entries: SplitEntry[];
  totalPages: number;
  onChange: (entries: SplitEntry[]) => void;
}

export function PageRangesForm({
  entries,
  totalPages,
  onChange,
}: PageRangesFormProps) {
  const update = (index: number, field: keyof SplitEntry, value: string | number) => {
    const updated = entries.map((e, i) =>
      i === index ? { ...e, [field]: field === "name" ? value : Number(value) } : e
    );
    onChange(updated);
  };

  const add = () => {
    const last = entries[entries.length - 1];
    const nextStart = last ? last.endPage + 1 : 1;
    onChange([
      ...entries,
      { name: `Patient ${entries.length + 1}`, startPage: nextStart, endPage: Math.min(nextStart, totalPages) },
    ]);
  };

  const remove = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const getRowError = (entry: SplitEntry): string | null => {
    if (!entry.name.trim()) return "Name required";
    if (entry.startPage < 1 || entry.startPage > totalPages) return `Start must be 1–${totalPages}`;
    if (entry.endPage < entry.startPage) return "End must be ≥ start";
    if (entry.endPage > totalPages) return `End must be ≤ ${totalPages}`;
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_90px_90px_36px] gap-2 text-xs font-medium text-gray-500 px-1">
        <span>Patient Name</span>
        <span>Start Page</span>
        <span>End Page</span>
        <span />
      </div>

      {entries.map((entry, i) => {
        const err = getRowError(entry);
        return (
          <div key={i} className="space-y-1">
            <div className="grid grid-cols-[1fr_90px_90px_36px] gap-2 items-center">
              <input
                type="text"
                value={entry.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder="Patient name"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={entry.startPage}
                min={1}
                max={totalPages}
                onChange={(e) => update(i, "startPage", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <input
                type="number"
                value={entry.endPage}
                min={1}
                max={totalPages}
                onChange={(e) => update(i, "endPage", e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <button
                onClick={() => remove(i)}
                disabled={entries.length === 1}
                className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {err && <p className="text-xs text-red-500 pl-1">{err}</p>}
          </div>
        );
      })}

      <button
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Patient
      </button>
    </div>
  );
}
