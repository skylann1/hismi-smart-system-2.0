import React from "react";

type Option = {
  value: string | number;
  label: string;
};

type RadioGroupProps = {
  options: Option[];
  name: string;
  value: string | number;
  className?: string;
  onChange: (value: string | number) => void;
};

const RadioButtonGroup = ({
  options,
  name,
  value,
  className = "grid grid-cols-2 gap-2",
  onChange,
}: RadioGroupProps) => {
  return (
    <div className={`${className}`}>
      {options?.map((option) => (
        <div key={option.value} className="w-full">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only peer"
          />

          <label
            htmlFor={`${name}-${option.value}`}
            className="
            w-full
            flex justify-center
              px-3 py-1.5 
              text-sm sm:text-xs font-medium 
              border border-gray-300 rounded-lg 
              bg-gray-100 
              text-gray-700
              cursor-pointer 
              transition-colors duration-200 ease-in-out
              peer-checked:bg-gray-700 
              peer-checked:text-white 
              peer-checked:border-gray-700
            "
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
