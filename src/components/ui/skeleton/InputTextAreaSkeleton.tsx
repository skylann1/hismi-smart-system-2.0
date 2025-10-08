export default function InputTextAreaSkeleton() {
  return (
    <div className="flex flex-col w-full relative">
        <div className="bg-gray-200 animate-pulse rounded-sm h-6 w-16"></div>
      {/* <label className="text-sm font-medium text-gray-700 mb-1">{title}</label> */}
      <div
        className={`w-full bg-gray-200 rounded-md px-2 pb-10 pt-1 mt-1 text-sm font-normal text-gray-800 focus:outline-none animate-pulse h-[34px]`}
      />
    </div>
  );
}
