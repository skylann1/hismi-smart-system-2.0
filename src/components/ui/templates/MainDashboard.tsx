/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  IoChatbubblesSharp,
  IoCalendarNumberSharp,
  IoTimeSharp,
  IoLocation,
} from "react-icons/io5";
import { BsCalendar2EventFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
// import { FaCartArrowDown, FaCartPlus } from "react-icons/fa";
import { inter } from "@/app/fonts";
import Image from "next/image";
import { useAppSelector } from "@/hooks/redux";
import { useState, useEffect } from "react";

const MainDashboard = () => {
  const { user } = useAppSelector((state) => state);
  const [anggota, setAnggota] = useState([]);
  const [acara, setAcara] = useState([]);
  const [kegiatan, setKegiatan] = useState([]);
  const [allKegiatan, setAllKegiatan] = useState([]);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [userPaymentStatus, setUserPaymentStatus] = useState<any>(null);

  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        const [resAnggota, resAcara, resKegiatan, resAllKegiatan, resSummary, resTransactions, resUserPayments] =
          await Promise.all([
            fetch("/dashboard/api/anggota"),
            fetch("/dashboard/api/proker"),
            fetch("/dashboard/api/kegiatan"),
            fetch("/dashboard/api/acara"),
            fetch("/dashboard/api/keuangan/summary"),
            fetch("/dashboard/api/keuangan/transaksi"),
            user.id ? fetch(`/dashboard/api/keuangan/bayar?userId=${user.id}`) : Promise.resolve(null),
          ]);

        const [anggotaJson, acaraJson, kegiatanJson, allKegiatanJson, summaryJson, transactionsJson, userPaymentsJson] =
          await Promise.all([
            resAnggota.json(),
            resAcara.json(),
            resKegiatan.json(),
            resAllKegiatan.json(),
            resSummary.json(),
            resTransactions.json(),
            resUserPayments ? resUserPayments.json() : Promise.resolve(null),
          ]);

        setAnggota(anggotaJson.data || []);
        setAcara(acaraJson.data || []);
        setKegiatan(kegiatanJson.data || []);
        setAllKegiatan(allKegiatanJson.data || []);

        if (summaryJson.success) {
          setFinancialSummary(summaryJson.data);
        }

        if (transactionsJson.success) {
          // Get recent 5 transactions
          const sorted = (transactionsJson.data || []).sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentTransactions(sorted.slice(0, 5));
        }

        if (userPaymentsJson && userPaymentsJson.success) {
          const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' });
          const currentYear = new Date().getFullYear().toString();
          const thisMonthPayment = (userPaymentsJson.data || []).find(
            (p: any) => p.bulan === currentMonth && p.tahun === currentYear
          );
          setUserPaymentStatus(thisMonthPayment);
        }
      } catch {
        console.error("Oops something when wrong in the server.");
      }
    };

    fetchAnggota();
  }, [user.id]);

  const latestEvent = allKegiatan.reduce((latest: any, current: any) => {
    if (!latest) return current;

    return new Date(current.tanggal).getTime() >
      new Date(latest.tanggal).getTime()
      ? current
      : latest;
  }, null);

  return (
    <div>
      <div className={`w-full flex flex-col min-h-screen ${inter.className}`}>
        <div className={`w-full flex flex-col md:flex-row rounded-xl bg-linear-to-b from-violet-500 to-violet-900  px-4 md:px-8 pt-8 gap-16`}>
          <div className="w-full flex flex-col justify-start items-start text-white md:mb-6">
            <h1 className="text-3xl drop-shadow-xl uppercase font-bold">
              SELAMAT DATANG, <span>{user.nama || "Sobat HIMSI"}</span>
            </h1>
            <span className=" text-sm opacity-90 font-semibold">
              HIMSI SMART SYSTEM
            </span>
            <p className="text-sm mt-6 opacity-90">
              Dashboard HIMSI UBSI KLA smart system dapat membantu setiap
              anggota untuk melakukan prosses absensi pertemuan atau acara,
              pembayaran uang kas. sistem ini merupakan versi 0.2 dari sistem
              himsi smart system pertama, jika terjadi kendala, silahkan hubungi
              divisi litbang atau pendidikan. diharapkan setiap anggota dapat
              membantu mengembangkan sistem ini menjadi lebih baik.
            </p>
          </div>
          <div className="w-full flex justify-center items-end">
            <div className="w-[80%] md:w-[60%]">
              <Image
                src="/assets/static-img/people.svg"
                height={5000}
                width={5000}
                alt="svdf"
                className="w-full object-center object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-y-4 flex-col md:flex-row justify-start items-start mt-6 md:justify-around">
          <div className="w-full md:w-[30%] p-2 flex gap-3 bg-white rounded-lg shadow border border-gray-300">
            <div className="w-[70px] h-16 bg-red-500 text-white flex justify-center items-center rounded-md border border-gray-300">
              <IoChatbubblesSharp className="text-4xl" />
            </div>
            <div className="flex flex-col min-h-full justify-between items-start py-1">
              <h3 className=" text-base opacity-90 font-semibold">Kegiatan</h3>
              <span className=" text-base opacity-90 font-semibold">
                {kegiatan?.length || 0}
              </span>
            </div>
          </div>
          <div className="w-full md:w-[30%] p-2 flex gap-3 bg-white rounded-lg shadow border border-gray-300">
            <div className="w-[70px] h-16 bg-green-500 text-white flex justify-center items-center rounded-md border border-gray-300">
              <BsCalendar2EventFill className="text-4xl" />
            </div>
            <div className="flex flex-col min-h-full justify-between items-start py-1">
              <h3 className="text-base opacity-90 font-semibold">Acara</h3>
              <span className=" text-base opacity-90 font-semibold">
                {acara?.length || 0}
              </span>
            </div>
          </div>
          <div className="w-full md:w-[30%] p-2 flex gap-3 bg-white rounded-lg shadow border border-gray-300">
            <div className="w-[70px] h-16 bg-yellow-500 text-white flex justify-center items-center rounded-md border border-gray-300">
              <IoIosPeople className="text-4xl" />
            </div>
            <div className="flex flex-col min-h-full justify-between items-start py-1">
              <h3 className=" text-base opacity-90 font-semibold">Anggota</h3>
              <span className=" text-base opacity-90 font-semibold">
                {anggota?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4 mt-6">
          <div className="w-full md:w-[40%] rounded-lg h-[26rem] bg-white border border-gray-300 flex flex-col overflow-hidden">
            <div className="w-full bg-primary flex justify-center py-4">
              <span className="text-white font-semibold text-base">
                Transaksi Keuangan Terbaru
              </span>
            </div>
            <div className="flex flex-col gap-4 h-full p-4 overflow-y-auto">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction: any, idx: number) => (
                  <div
                    key={idx}
                    className="w-full hover:bg-gray-100 transition-all ease-in-out duration-300 rounded-md flex justify-between items-start p-2 border-b border-gray-200"
                  >
                    <div className="flex gap-2">
                      <div className={`w-12 h-12 ${transaction.tipe === "pemasukan" ? "bg-green-600" : "bg-red-600"} flex justify-center items-center rounded-md text-white text-xs`}>
                        {transaction.tipe === "pemasukan" ? "IN" : "OUT"}
                      </div>
                      <div className="flex flex-col justify-start gap-1">
                        <span className="text-sm font-medium">{transaction.judul}</span>
                        <p className="text-xs font-medium opacity-90">
                          {transaction.tanggal}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold ${transaction.tipe === "pemasukan" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.tipe === "pemasukan" ? "+" : "-"}Rp {transaction.jumlah.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center gap-2">
                  <div className="text-gray-300 mb-2">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Belum ada transaksi
                  </span>
                  <p className="text-xs text-gray-500 text-center">
                    Transaksi akan muncul di sini
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-[60%] rounded-lg h-fit md:h-[26rem] min-h-60 bg-primary border border-gray-300 flex flex-col overflow-hidden justify-center items-center px-4 py-10 text-white gap-8 md:gap-16">
            {financialSummary ? (
              // All members view - Financial Summary
              <>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 w-full">
                  {user.access?.includes("7") && (
                    <div className="flex flex-col justify-center items-center">
                      <span className="text-4xl font-semibold">
                        {financialSummary.pendingCount || 0}
                      </span>
                      <span className="text-xs opacity-80 font-medium">
                        PEMBAY ARAN MENUNGGU
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-3xl font-semibold">
                      Rp {(financialSummary.balance || 0).toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs opacity-80 font-medium">
                      SALDO SAAT INI
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-300">
                      +Rp {(financialSummary.totalIncome || 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs opacity-80 mt-1">Total Pemasukan</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-300">
                      -Rp {(financialSummary.totalExpense || 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs opacity-80 mt-1">Total Pengeluaran</p>
                  </div>
                </div>
                <a
                  href="/dashboard/keuangan"
                  className="px-6 py-2 bg-white text-primary rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Lihat Detail Keuangan →
                </a>
              </>
            ) : (
              // Loading state
              <div className="w-full h-full flex flex-col justify-center items-center gap-4">
                <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin"></div>
                <span className="text-sm opacity-80">Memuat data keuangan...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4 mt-6 h-140 md:h-104">
          <div className="w-full md:w-[70%] h-full rounded-lg bg-white border border-gray-300 flex flex-col overflow-hidden">
            <div className="w-full bg-primary text-white p-4 flex justify-center">
              <span className="font-semibold text-base">Anggota Terbaru</span>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 w-full">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Divisi
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {anggota.slice(0, 5).map(
                    (
                      anggotaItem: {
                        id: string;
                        nama: string;
                        divisi: string;
                      },
                      index
                    ) => (
                      <tr
                        key={anggotaItem.id}
                        className="odd:bg-white even:bg-gray-50 border-b border-gray-200"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">{anggotaItem.nama}</td>
                        <td className="px-6 py-4">{anggotaItem.divisi}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full md:w-[30%] h-full">
            <div className="w-full h-fit md:h-1/2 bg-white border border-gray-300 rounded-xl flex flex-col justify-start items-center shadow">
              <div className="w-full border-b border-gray-300 p-4 md:p-3 flex justify-start items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-200 bg-opacity-15 flex justify-center items-center">
                  <IoCalendarNumberSharp className="text-lg text-sky-500 drop-shadow-2xl" />
                </div>
                <span className="font-semibold text-sm opacity-90">
                  Kegiatan Mendatang
                </span>
              </div>

              {latestEvent ? (
                <div className="flex flex-col px-4 md:px-3 w-full">
                  <div className=" text-sm opacity-90 border-b border-gray-300 py-4 w-full flex justify-start items-center gap-2">
                    <IoTimeSharp className="text-xl text-blue-900 " />
                    <span className="font-medium text-sm opacity-95">
                      {latestEvent?.tanggal}, {latestEvent?.jamMulai} -{" "}
                      {latestEvent?.jamSelesai}
                    </span>
                  </div>
                  <div className="flex flex-col flex-grow gap-2 pt-4 pb-4 justify-center items-start">
                    <span className="flex gap-1 justify-center items-center p-1 bg-gray-100 rounded-md">
                      <div className="w-4">
                        <IoLocation className="text-lg text-red-600" />
                      </div>
                      <span className="font-medium text-xs opacity-95">
                        {latestEvent?.lokasi || "Lokasi belum ditentukan"}
                      </span>
                    </span>
                    <span className="flex gap-1 justify-center items-center p-1 bg-gray-100 rounded-md">
                      <div className="w-4">
                        <div className="ml-1 w-[10px] h-[10px] rounded-full bg-green-400"></div>
                      </div>
                      <span className="font-medium text-xs opacity-70">
                        Pembahasan{" "}
                        {latestEvent?.judul || "Judul belum ditentukan"}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center p-6 text-center">
                  <div className="text-gray-400 mb-3">
                    <IoCalendarNumberSharp className="text-5xl mx-auto" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Tidak ada kegiatan yang akan datang
                  </p>
                  <p className="text-xs text-gray-500">
                    Pantau terus untuk update jadwal terbaru
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
