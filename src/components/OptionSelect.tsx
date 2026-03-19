"use client";

interface OptionSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function OptionSelect({
  label,
  value,
  options,
  onChange,
}: OptionSelectProps) {
  return (
    <td className="px-1 py-1 border border-slate-200">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title={label}
        className="w-full text-xs px-1 py-1 border border-slate-300 rounded bg-amber-50 text-blue-700 font-medium focus:ring-1 focus:ring-blue-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </td>
  );
}
