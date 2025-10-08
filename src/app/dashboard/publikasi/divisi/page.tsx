"use client";

import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";

export default function Page() {
  const section1Ref = useRef<HTMLDivElement | null>(null);
  const handleScrollToSection1 = () => {
    section1Ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex flex-col items-start justify-start bg-white p-4 w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-[50%_50%] gap-y-16 gap-x-4">
        <div className="w-full flex justify-center">
          <Image
            src="/assets/undraw/deep_work.svg"
            width={1000}
            height={1000}
            alt="logo"
            className="w-[70%] h-auto object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-between items-start h-full">
          <div className="pr-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Publikasi divisi
            </h1>
            <p className="text-gray-700 mt-2 font-normal text-sm">
              Atur halaman publikasi divisi disini, apa yang di atur di halaman
              ini akan tampil di halaman publikasi divisi pada website, semua
              yang membuka halaman bisa melihat tanpa perlu login(guest).
              pastikan anda mengisi data dengan benar, jika anda salah
              menggunakan akses ini, admin akan memantau dan langsung melakukan
              peninjauan ulang. dibawah ini contoh yang bisa anda atur di
              halaman ini.
            </p>
          </div>

          <div className="flex w-full lg:justify-end lg:pr-6 mt-8">
            <button
              className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2 cursor-pointer"
              onClick={handleScrollToSection1}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* tutorial section */}
      <div className="w-full flex flex-col gap-16 mt-32">
        <div
          className="flex flex-col items-start"
          id="section-1"
          ref={section1Ref}
        >
          <div className="grid grid-cols-[80%] justify-center gap-8 mt-4 w-full">
            <div className="border-[1.5px] p-2 border-gray-100 rounded-lg shadow-lg">
              <Image
                src="/assets/static-img/publikasi_guide_divisi1.png"
                width={1000}
                height={1000}
                alt="logo"
                className="w-full h-auto object-cover object-center"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="grid grid-cols-[80%] justify-center gap-8 mt-4 w-full">
            <div className="border-[1.5px] p-2 border-gray-100 rounded-lg shadow-lg">
              <Image
                src="/assets/static-img/publikasi_guide_divisi2.png"
                width={1000}
                height={1000}
                alt="logo"
                className="w-full h-auto object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[50%_50%] gap-y-16 gap-x-4 mt-32">
        <div className="flex flex-col justify-start items-start h-full">
          <div className="pr-4">
            <h1 className="text-3xl font-bold text-gray-800">After thats</h1>
            <p className="text-gray-700 mt-2 font-normal text-sm">
              Setelah berhasil mengetahui apa saja yang dapat dilakukan di
              halaman publikasi divisi, sekarang anda dapat mengatur halaman
              publikasi divisi sesuai dengan kebutuhan divisi, pastikan anda
              mengisi data dengan benar, jika anda salah menggunakan akses ini,
              admin akan memantau dan langsung melakukan peninjauan ulang.
              Terima kasih telah membaca panduan ini, semoga bermanfaat dan
              membantu anda dalam mengelola halaman publikasi divisi.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            <ul className="list-inside flex flex-col gap-1">
              <p className="text-gray-700 mt-6 font-normal text-sm max-w-sm">
                Berikut link untuk untuk mengatur masing-masing page setiap
                divisi:
              </p>
              <li>
                <Link
                  href={"/dashboard/publikasi/divisi/pendidikan"}
                  className="text-blue-500 underline cursoir-pointer"
                >
                  Pendidikan
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/publikasi/divisi/rsdm"}
                  className="text-blue-500 underline cursoir-pointer"
                >
                  Rsdm
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/publikasi/divisi/litbang"}
                  className="text-blue-500 underline cursoir-pointer"
                >
                  Litbang
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/publikasi/divisi/kominfo"}
                  className="text-blue-500 underline cursoir-pointer"
                >
                  Kominfo
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full lg:flex justify-center hidden">
          <Image
            src="/assets/undraw/travels.svg"
            width={1000}
            height={1000}
            alt="logo"
            className="w-wfull object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
