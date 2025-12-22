"use client";

import React from "react";

interface InputTimeProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: { status: boolean; message: string };
  required?: boolean;
}

const InputTime: React.FC<InputTimeProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="time"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 ${
          error?.status ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error?.status && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default InputTime;
