import MoneyPreview from "@/components/ui/organisms/MoneyPreview";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full bg-white md:p-6 p-4">
      <MoneyPreview></MoneyPreview>
      <div className="mt-12 w-full">
        <div className="w-full grid grid-cols-1 xl:grid-cols-[22%_40%_35%] xl:justify-between gap-y-4 gap-x-3">
          <div className="bg-primary rounded-lg text-white flex flex-col justify-center items-center py-8 px-4 gap-y-6">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Maret</span>
              <span className="text-sm font-normal text-gray-400">
                Kas bulan ini
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold">Rp 1.000.000</span>
              <span className="text-sm font-normal text-gray-400">
                Terkumpul
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="w-full bg-gray-300 rounded-t-xl grid grid-cols-[15%_50%_35%] p-3">
              <span className="text-xs font-bold">NO</span>
              <span className="text-xs font-bold">NAMA/DIVISI</span>
              <span className="text-xs font-bold">TAGIHAN</span>
            </div>
            <div className="flex flex-col text-gray-700">
              <Link
                href={"/dashboard/keuangan/kas/anggota"}
                className="grid grid-cols-[15%_50%_35%] px-2 border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-sm font-semibold">1</span>
                <span className="text-sm font-semibold flex flex-col">
                  <span className="font-semibold">Sahlan muzaqi</span>
                  <span className="text-xs font-normal">Pendidikan</span>
                </span>
                <span className="text-sm font-semibold">Rp 100.000</span>
              </Link>
              <Link
                href={"/dashboard/keuangan/kas/anggota"}
                className="grid grid-cols-[15%_50%_35%] px-2 border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-sm font-semibold">1</span>
                <span className="text-sm font-semibold flex flex-col">
                  <span className="font-semibold">Sahlan muzaqi</span>
                  <span className="text-xs font-normal">Pendidikan</span>
                </span>
                <span className="text-sm font-semibold">Rp 100.000</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="rounded-t-xl bg-primary flex justify-center items-center py-2">
              <h3 className="text-base font-normal text-white">
                Histori kas bulanan
              </h3>
            </div>
            <div className="flex flex-col text-gray-800 border border-gray-300">
              <div className="w-full grid grid-cols-[15%_40%_45%] p-2">
                <span className="text-xs font-bold">NO</span>
                <span className="text-xs font-bold">BULAN</span>
                <span className="text-xs font-bold">TERKUMPUL</span>
              </div>
              <div className="flex flex-col text-gray-600">
                <Link
                  href={"/dashboard/keuangan/kas/bulan"}
                  className="grid grid-cols-[15%_40%_45%] px-2 border-b border-gray-200 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="text-sm font-semibold">1</span>
                  <span className="text-sm font-semibold flex flex-col">
                    Januari
                  </span>
                  <span className="text-sm font-semibold">Rp 100.000</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
