import React from "react";

type InputSelectTahunProps = {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  className?: string;
};

const InputSelectYear = ({
  value,
  onChange,
  label = "Tahun",
  className = "",
}: InputSelectTahunProps) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 2;
  const maxYear = currentYear + 1;

  const years = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y.toString());
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        required
        value={value}
        onChange={onChange}
        className="
          w-full
          px-4 py-2
          rounded-md
          border border-gray-300
          bg-white
          text-sm text-gray-700
          shadow-sm
          focus:outline-none focus:ring-1 focus:ring-indigo-600
          transition-all
          cursor-pointer
        "
      >
        <option value="" disabled>
          Pilih tahun
        </option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelectYear;
