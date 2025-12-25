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

  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        const [resAnggota, resAcara, resKegiatan, resAllKegiatan] =
          await Promise.all([
            fetch("/dashboard/api/anggota"),
            fetch("/dashboard/api/proker"),
            fetch("/dashboard/api/kegiatan"),
            fetch("/dashboard/api/acara"),
          ]);

        const [anggotaJson, acaraJson, kegiatanJson, allKegiatanJson] =
          await Promise.all([
            resAnggota.json(),
            resAcara.json(),
            resKegiatan.json(),
            resAllKegiatan.json(),
          ]);

        setAnggota(anggotaJson.data || []);
        setAcara(acaraJson.data || []);
        setKegiatan(kegiatanJson.data || []);
        setAllKegiatan(allKegiatanJson.data || []);
      } catch {
        console.error("Oops something when wrong in the server.");
      }
    };

    fetchAnggota();
  }, []);

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
                Rekapitulasi keuangan
              </span>
            </div>
            <div className="flex flex-col gap-4 h-full p-4 overflow-y-auto">
              {/* <div className="w-full hover:bg-gray-100 transition-all ease-in-out duration-300 rounded-md flex justify-between items-start p-2">
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-red-700 flex justify-center items-center rounded-md">
                    <FaCartArrowDown className="text-2xl text-white" />
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <span className="text-sm font-medium">Santunan yatim</span>
                    <p className="text-xs font-medium opacity-90">
                      10 mar 2025
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold opacity-80">
                    Rp 500,000
                  </span>
                </div>
              </div>
              <div className="w-full hover:bg-gray-100 transition-all ease-in-out duration-300 rounded-md flex justify-between items-start p-2">
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-green-700 flex justify-center items-center rounded-md">
                    <FaCartPlus className="text-2xl text-white" />
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <span className="text-sm font-medium">Santunan yatim</span>
                    <p className="text-xs font-medium opacity-90">
                      20 feb 2025
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold opacity-80">
                    Rp 250,000
                  </span>
                </div>
              </div> */}
              <div className="w-full h-full flex justify-center items-center">
                <span className="text-sm font-medium opacity-80 text-center">
                  Cooming soon ya man teman, butuh liburan cape ngoding mulu....
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[60%] rounded-lg h-fit md:h-[26rem] min-h-60 bg-primary border border-gray-300 flex flex-col overflow-hidden justify-center items-center px-4 py-10 text-white gap-8 md:gap-16">
            {/* <div className="flex flex-col justify-center items-center">
              <span className="text-4xl font-semibold">8</span>
              <span className="text-xs opacity-80 font-medium">
                BULAN TAGIHAN KAS
              </span>
            </div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-3xl font-semibold">Rp. 80,000</span>
              <span className="text-xs opacity-80 font-medium">
                TOTAL YANG HARUS DI BAYAR
              </span>
            </div> */}
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-sm font-medium opacity-80 text-center">
                Ini juga sama cooming soon yaaa....
              </span>
            </div>
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
                  Upcoming <span className="opacity-70 text-xs">•</span>{" "}
                  {latestEvent?.type || "No Event"}
                </span>
              </div>
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
                      {latestEvent?.lokasi || "Lokasi belum di tentukan"}
                    </span>
                  </span>
                  <span className="flex gap-1 justify-center items-center p-1 bg-gray-100 rounded-md">
                    <div className="w-4">
                      <div className="ml-1 w-[10px] h-[10px] rounded-full bg-green-400"></div>
                    </div>
                    <span className="font-medium text-xs opacity-70">
                      Pembahasan{" "}
                      {latestEvent?.judul || "Judul belum di tentukan"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
