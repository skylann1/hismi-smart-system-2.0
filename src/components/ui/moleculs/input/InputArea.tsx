// "@/components/ui/moleculs/input/InputTextArea.tsx"

import React from "react";

interface InputTextAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isError?: {
    status: boolean;
    message: string;
  };
  rows?: number; 
}

export default function InputTextArea({
  name,
  label,
  placeholder,
  className,
  value,
  onChange,
  isError,
  rows = 4,
}: InputTextAreaProps) {
  return (
    <div className="flex flex-col w-full relative pb-5"> 
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${className} w-full bg-gray-50 border-[1.5px] border-gray-100 rounded-md px-2 pb-2 pt-1 mt-1 text-sm font-normal text-gray-800 focus:outline-none resize-y ${ // Tambah resize-y
          isError?.status
            ? "border-red-500"
            : "focus:outline-none focus:border-indigo-600"
        }`}
        required
      />

      {isError?.status && (
        <span className="text-red-500 text-sm mt-1 absolute bottom-0 left-0">
          {isError.message}
        </span>
      )}
    </div>
  );
}