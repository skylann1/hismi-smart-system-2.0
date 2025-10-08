"use client";

import { useState, useId, useMemo } from "react";

interface InputDateProps {
  value?: string;
  onChange?: (v: string) => void;
  label?: string;
  className?: string;
  isError?: {
    status: boolean;
    message: string;
  };
  disableFutureDates?: boolean;
}

export default function InputDate({
  value = "",
  onChange,
  label = "Tanggal", 
  className = "",
  isError = {
    status: false,
    message: "",
  },
  disableFutureDates = true,
}: InputDateProps) {
  const [internal, setInternal] = useState(value);
  const id = useId();
  const currentValue = value !== undefined ? value : internal;

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const isFuture = disableFutureDates && currentValue > today;
  const showError = isFuture || isError.status;

  const handleChange = (v: string) => {
    if (onChange) onChange(v);
    else setInternal(v);
  };

  return (
    <div className={`w-full ${className} relative `}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        *{label}
      </label>
      <div className="relative ">
        <input
          required
          id={id}
          type="date"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          max={disableFutureDates ? today : undefined}
          aria-invalid={showError ? "true" : undefined}
          aria-describedby={showError ? `${id}-error` : undefined}
          className={`w-full bg-gray-50 border-[1.5px] border-gray-100 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none text-sm font-normal text-gray-800 cursor-pointer
            ${showError ? "ring-1 ring-red-500" : "focus:border-indigo-600"}`}
          placeholder="yyyy-mm-dd"
        />
      </div>
      {/* Tampilkan pesan error jika ada */}
      {showError && (
        <p
          id={`${id}-error`}
          className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0"
        >
          {isFuture ? "Tanggal tidak boleh di masa depan" : isError?.message}
        </p>
      )}
    </div>
  );
}
