"use client";
import { useState } from "react";

import ModalPrimary from "@/components/ui/templates/modal/ModalPrimary";
import { IoIosWarning } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import Image from "next/image";

type bulan = {
  id: number;
  label: string;
};

const allBulan: bulan[] = [
  { id: 1, label: "Januari" },
  { id: 2, label: "Februari" },
  { id: 3, label: "Maret" },
  { id: 4, label: "April" },
  { id: 5, label: "Mei" },
  { id: 6, label: "Juni" },
  { id: 7, label: "Juli" },
  { id: 8, label: "Agustus" },
  { id: 9, label: "September" },
  { id: 10, label: "Oktober" },
  { id: 11, label: "November" },
  { id: 12, label: "Desember" },
];

export default function ModalDetailKasAnggota() {
  const [selectedMonth, setSelectedMonth] = useState<number[]>([1, 2, 3]);
  const handleSelectChip = (chipId: number) => {
    setSelectedMonth((prevSelected) => {
      // If the chip is already selected, unselect it
      if (prevSelected.includes(chipId)) {
        return prevSelected.filter((id) => id !== chipId);
      }
      // Otherwise, add it to the selected list
      return [...prevSelected, chipId];
    });
  };

  return (
    <ModalPrimary>
      <div className="flex flex-col md:flex-row gap-8 py-4">
        <div className="hidden md:block">
          <Image
            src="/assets/undraw/credit-card.svg"
            height={5000}
            width={5000}
            alt="svdf"
            className="w-72 object-center object-cover"
          />
        </div>
        <div className="flex flex-col xl:w-85">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-gray-800">Pilih bulan</h3>
              <span className="flex items-center gap-1 text-sm font-normal text-gray-600">
                <IoIosWarning className="text-sm mt-0.5 text-red-700/70" />{" "}
                Bulan harus berurutan
              </span>
            </div>
            <span className="text-xs font-semibold text-sky-700">
              Selected {selectedMonth.length}
            </span>
          </div>
          <div className="w-full grid grid-cols-3 gap-3 mt-4">
            {allBulan.map((chip) => {
              const isSelected = selectedMonth.includes(chip.id);
              return (
                <button
                  key={chip.id}
                  onClick={() => handleSelectChip(chip.id)}
                  className={`
                flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium
                transition-colors duration-200 ease-in-out cursor-pointer
                ${
                  isSelected
                    ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
                >
                  {isSelected && <FaCheck className="text-xs" />}
                  {chip.label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end mt-8">
            <button className="text-sm font-semibold text-white bg-primary px-3 py-1 rounded-sm">
              Submit
            </button>
          </div>
        </div>
      </div>
    </ModalPrimary>
  );
}
