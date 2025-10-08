// components/DateRangeFilter.tsx
"use client";

import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

// Define the structure for a filter option
type FilterOption = {
  value: string;
  label: string;
};

// Define the available filter options
const FILTER_OPTIONS: FilterOption[] = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'all-time', label: 'All Time' },
];

// Define the component's props
interface DateRangeFilterProps {
  defaultValue?: string;
  onFilterChange: (value: string) => void;
}

export default function DateRangeFilter({
  defaultValue = 'this-month',
  onFilterChange,
}: DateRangeFilterProps) {
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    () => FILTER_OPTIONS.find((opt) => opt.value === defaultValue) || FILTER_OPTIONS[0]
  );

  const handleSelect = (option: FilterOption) => {
    setSelectedOption(option);
    onFilterChange(option.value);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-2 rounded-md bg-white px-1 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-0 cursor-pointer">
          <CalendarIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
          {selectedOption.label}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/30 ring-opacity-5 focus:outline-none cursor-pointer">
          <div className="py-1">
            {FILTER_OPTIONS.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => handleSelect(option)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center px-4 py-2 text-sm cursor-pointer`}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}