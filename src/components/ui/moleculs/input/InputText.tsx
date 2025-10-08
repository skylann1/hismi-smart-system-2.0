export default function InputText({
  type,
  name,
  label,
  placeholder,
  className,
  value,
  onChange,
  isError,
}: {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: {
    status: boolean;
    message: string;
  };
}) {
  return (
    <div className="flex flex-col w-full relative">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} w-full bg-gray-50 border-[1.5px] border-gray-100 rounded-md px-2 pb-2 pt-1 mt-1 text-sm font-normal text-gray-800 focus:outline-none ${
          isError?.status
            ? "border-red-500"
            : " focus:outline-none focus:border-indigo-600"
        }`}
        required
      />

      {isError?.status && (
        <span className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0">
          {isError.message}
        </span>
      )}
    </div>
  );
}
