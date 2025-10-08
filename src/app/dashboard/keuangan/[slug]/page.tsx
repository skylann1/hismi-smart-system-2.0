"use client";

import DateRangeFilter from "@/components/ui/moleculs/calendar/DateRangeFilter";
import { useState } from "react";
import { PiWarningCircleFill } from "react-icons/pi";
import SecondaryTable from "@/components/ui/moleculs/table/SecondaryTable";
import Link from "next/link";

export default function Page() {
  const [currentFilter, setCurrentFilter] = useState("this-month");

  const handleFilterChange = (newFilterValue: string) => {
    setCurrentFilter(newFilterValue);
  };
  return (
    <div className="w-full bg-white md:p-6 p-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pemasukan</h1>
        <Link
          href="/dashboard/keuangan/pemasukan/tambah"
          className="text-sm font-semibold text-white bg-primary px-4 py-1 rounded-sm"
        >
          Tambah
        </Link>
      </div>
      <div className="rounded-xl w-full p-4 md:p-6 bg-gray-100 flex flex-col mt-3">
        <div className="flex w-full justify-between items-start gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold opacity-80">Total</h3>
            <span className="text-3xl font-semibold opacity-90">
              Rp 1.000.000
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <DateRangeFilter
              defaultValue={currentFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[55%_1%_40%] gap-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
            <div className="flex flex-col justify-start items-start ">
              <div className="text-[13px] font-semibold opacity-60 flex justify-center items-center gap-1">
                <span>Tertinggi</span>{" "}
                <span className="mt-0.5">
                  <PiWarningCircleFill />
                </span>
              </div>
              <span className="text-xl font-semibold opacity-90">
                Rp 1.000.000
              </span>
            </div>
            <div className="flex flex-col justify-start items-start ">
              <div className="text-[13px] font-semibold opacity-60 flex justify-center items-center gap-1">
                <span>Terendah</span>{" "}
                <span className="mt-0.5">
                  <PiWarningCircleFill />
                </span>
              </div>
              <span className="text-xl font-semibold opacity-90">
                Rp 1.000.000
              </span>
            </div>
            <div className="flex flex-col justify-start items-start ">
              <div className="text-[13px] font-semibold opacity-60 flex justify-center items-center gap-1">
                <span>Rata - Rata</span>{" "}
                <span className="mt-0.5">
                  <PiWarningCircleFill />
                </span>
              </div>
              <span className="text-xl font-semibold opacity-90">
                Rp 1.000.000
              </span>
            </div>
          </div>
          <div className="bg-gray-200 h-full w-[1px]"></div>
          <span className="text-xs md:text-sm font-semibold text-gray-800">
            Rata - rata diambil dari{" "}
            <span className="text-green-600">Terendah</span> dan{" "}
            <span className="text-red-600">Tertinggi</span>, berdasarkan filter
            data yang dipilih.
          </span>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-100 my-4"></div>
      <SecondaryTable />
    </div>
  );
}
