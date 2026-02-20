"use client";

interface PatientNameListProps {
  names: string[];
  onChange: (names: string[]) => void;
}

export function PatientNameList({ names, onChange }: PatientNameListProps) {
  const update = (i: number, value: string) => {
    const updated = [...names];
    updated[i] = value;
    onChange(updated);
  };

  const add = () => onChange([...names, ""]);

  const remove = (i: number) => onChange(names.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {names.map((name, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-6 text-right shrink-0">{i + 1}.</span>
          <input
            type="text"
            value={name}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Patient name ${i + 1}`}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={() => remove(i)}
            disabled={names.length === 1}
            className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium mt-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Patient
      </button>
    </div>
  );
}
