"use client";

interface PatientNameListProps {
  patients: string[];
  onChange: (patients: string[]) => void;
}

export function PatientNameList({ patients, onChange }: PatientNameListProps) {
  const update = (i: number, value: string) => {
    const updated = [...patients];
    updated[i] = value;
    onChange(updated);
  };

  const add = () => onChange([...patients, ""]);

  const remove = (i: number) => onChange(patients.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {patients.map((text, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Patient {i + 1}</span>
            <button
              onClick={() => remove(i)}
              disabled={patients.length === 1}
              className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Remove
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => update(i, e.target.value)}
            rows={5}
            placeholder={"FNU Smith\n5478282828190 ON\nDOB 04/05/1996\n50 Herrick Ave, St Catharines"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y font-mono"
            spellCheck={false}
          />
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-medium"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Patient
      </button>
    </div>
  );
}
