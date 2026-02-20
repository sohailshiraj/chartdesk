"use client";

interface FixedCountFormProps {
  totalPages: number;
  pagesPerPatient: number;
  names: string[];
  onPagesPerPatientChange: (val: number) => void;
  onNamesChange: (names: string[]) => void;
}

export function FixedCountForm({
  totalPages,
  pagesPerPatient,
  names,
  onPagesPerPatientChange,
  onNamesChange,
}: FixedCountFormProps) {
  const count = pagesPerPatient > 0 ? Math.ceil(totalPages / pagesPerPatient) : 0;

  const updateName = (i: number, value: string) => {
    const updated = [...names];
    updated[i] = value;
    onNamesChange(updated);
  };

  // Ensure names array is the right length
  const filledNames = Array.from({ length: count }, (_, i) => names[i] ?? "");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Pages per patient
        </label>
        <input
          type="number"
          value={pagesPerPatient}
          min={1}
          max={totalPages}
          onChange={(e) => onPagesPerPatientChange(Math.max(1, Number(e.target.value)))}
          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
        />
        {count > 0 && (
          <span className="text-sm text-gray-500">
            → {count} patient{count !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {count > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 px-1">
            Patient Names (optional — defaults to Patient 1, 2…)
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {filledNames.map((name, i) => {
              const start = i * pagesPerPatient + 1;
              const end = Math.min((i + 1) * pagesPerPatient, totalPages);
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20 shrink-0">
                    p{start}–{end}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder={`Patient ${i + 1}`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
