/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { inter } from "../../fonts";
import Image from "next/image";
import { ImBullhorn } from "react-icons/im";
import { SiSololearn } from "react-icons/si";
import { PiArrowBendRightUpThin } from "react-icons/pi";
import {
  FaConnectdevelop,
  FaNetworkWired,
  FaPeopleCarry,
} from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { GiTechnoHeart, GiOwl, GiWolfHowl, GiAnt, GiDolphin  } from "react-icons/gi";
import { FaPeopleGroup } from "react-icons/fa6";
import { HiAcademicCap } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import GuestFooter from "@/components/ui/organisms/GuestFooter";

export default function Page() {
  const [firstFaq, setFirstFaq] = useState(false);
  const [twoFaq, setTwoFaq] = useState(false);
  const [threeFaq, setThreeFaq] = useState(false);
  const [fourFaq, setFourFaq] = useState(false);
  const [fiveFaq, setFiveFaq] = useState(false);
  // console.log(firstFaq);
  return (
    <div className="w-full">
      <div className="w-full h-[85vh] flex justify-between items-center md:px-12 px-6 relative  bg-linear-to-t from-white to-transparent">
        <div className="absolute top-0 w-[120%] h-full -z-10 left-0 opacity-60">
          <Image
            src={"/assets/static-img/background.jpg"}
            width={500}
            height={500}
            alt="background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-start md:w-1/2">
          <span className={`${inter.className} text-xl font-bold`}>
            Hi, Perkenalkan!
          </span>
          <span className={`${inter.className} text-5xl font-bold`}>
            Himpunan Mahasiswa Sistem Informasi
          </span>
          <span className={`${inter.className} font-medium text-sm`}>
            Selamat datang di website Himpunan Mahasiswa Sistem Informasi Fakultas Teknik & Informatika
            Universitas Bina Sarana Informatika Kaliabang.
          </span>
        </div>
        <div className="md:w-1/2 h-full relative flex justify-center items-end ">
          <div className="w-80 h-80 rounded-full flex justify-center items-center bg-gradient-to-b from-[#0c1250]/15 to-transparent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
            <div className="w-[85%] h-[85%] rounded-full flex justify-center items-center  bg-gradient-to-b from-[#0c1250]/30 to-transparent">
              <div className="w-[85%] h-[85%] rounded-full flex justify-center items-end  bg-gradient-to-b from-[#0c1250]/45 to-transparent"></div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-72">
              <Image
                src={"/assets/static-img/isSay.png"}
                width={300}
                height={300}
                alt="isSay"
                className="w-full object-cover object-center"
              />
            </div>
            <div className="w-80 bg-sky-300/20 rounded-t-md h-40 border-x border-t border-slate-200 flex flex-col justify-center items-center p-6">
              <figure className="max-w-screen-md mx-auto text-center">
                <svg
                  className="w-5 h-5 mx-auto mb-1 text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 14"
                >
                  <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                </svg>
                <blockquote>
                  <p className="text-xs italic font-medium text-gray-900">
                    &quot;Flowbite is just awesome. It contains tons of
                    predesigned components and pages starting from login screen
                    to complex dashboard. Perfect choice for your next SaaS
                    application.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center justify-center mt-2 space-x-3 rtl:space-x-reverse">
                  <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-500 ">
                    <cite className="pe-2 font-medium text-gray-900 ">
                      Nabilah azzahra
                    </cite>
                    <cite className="ps-2 text-sm text-gray-500 ">
                      Div Kominfo
                    </cite>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:px-12 px-6 flex flex-col justify-center">
        <div className="w-full bg-white rounded-b-2xl flex  justify-center items-center md:py-8 md:px-12 shadow-2xl ">
          <div className=" flex justify-center">
            <div className="w-80">
              <Image
                src={"/assets/static-img/logo.png"}
                width={500}
                height={500}
                alt="logo"
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col text-slate-900">
            <h1 className="text-xl font-semibold">
              Apa itu <span>HIMSI?</span>
            </h1>
            <span className="text-sm opacity-80 font-normal">
              HIMSI KLA (Himpunan Mahasiswa Sistem Informasi Kaliabang) adalah
              organisasi mahasiswa di Jurusan Sistem Informasi Universitas BSI
              Kaliabang. Kami berfokus pada kegiatan dan pengembangan mahasiswa
              untuk memajukan bidang Sistem Informasi dan teknologi informasi di
              kampus kami.
            </span>
          </div>
        </div>
        <div className="flex flex-wrap w-full mt-12 justify-between">
          <div className="flex flex-col md:w-[48%]">
            <span className="text-xl font-bold uppercase">Visi</span>
            <ul className="list-disc pl-4 mt-2 text-slate-800 text-sm font-medium">
              <li>
                Membangun suasana dengan konsep kekeluargaan didalam organisasi
                & menghilangkan kerenggangan antar generasi.
              </li>
            </ul>
          </div>
          <div className="md:w-[48%] flex flex-col">
            <span className="text-xl font-bold uppercase">Misi</span>
            <ul className="list-disc pl-4 mt-2 text-slate-800 text-sm font-medium">
              <li className="">
                Penguatan Individu: Memberikan peluang dan dukungan untuk
                pengembangan pribadi dan akademik setiap anggota.
              </li>
              <li className="mt-2">
                Terbuka dan Responsif: Menjadi organisasi yang terbuka,
                responsif, dan mudah diakses oleh setiap anggota.
              </li>
              <li className="mt-2">
                Inklusivitas: Menciptakan ruang inklusif di mana setiap anggota
                merasa dihargai tanpa memandang latar belakang atau keahlian.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:px-12 px-6 justify-start items-center mt-12">
        <span className={`font-bold text-xl`}>SEJARAH</span>

        <ol className="w-full flex justify-center items-start mt-3">
          <li className="relative mb-6 sm:mb-0 md:w-[33%]">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full ring-0 ring-whit shrink-0">
                <svg
                  className="w-4 h-4 color-primary "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <div className="hidden sm:flex w-full bg-primary h-[2px]"></div>
            </div>
            <div className="mt-1 sm:pe-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Terbentuknya HiMMI sebagai awal mula dari HIMSI
              </h3>
              <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                Created on December 2, 2006
              </time>
              <p className={`font-normal text-gray-500 text-sm`}>
                Himpunan Mahasiswa Manajemen Informatika(HIMMI) atau yang
                sekarang disebut Himpunan Mahsiswa Sistem Informasi(HIMSI) sudah
                terbentuk pada tanggal 23 juli 2006 bertempat di kampus UBSI
                fatmawati dan diikuti oleh cabang lainnya seperti cengkareng
                pada tanggal 24 Oktober 2012, cikarang pada tanggal 26 Oktober
                2011 dan beberapa cabang lainnya didalam dan diluar Jabodetabek
              </p>
            </div>
          </li>

          <li className="relative mb-6 sm:mb-0 md:w-[33%]">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full ring-0 ring-whit shrink-0">
                <svg
                  className="w-4 h-4 color-primary "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <div className="hidden sm:flex w-full bg-primary h-[2px]"></div>
            </div>
            <div className="mt-1 sm:pe-8">
              <h3 className="text-lg font-semibold text-gray-900">
                HIMSI UBSI secara resmi berdiri
              </h3>
              <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                Created on December 2, 2006
              </time>
              <p className="font-normal text-gray-500 text-sm">
                Pada tanggal 31 januari HIMSI UBSI secara resmi berdiri menurut
                SK No.601/1.02/UBSI/I/2019 oleh REKTOR UBSI. Saat ini HIMSI UBSI
                sudah ada dibeberapa kampus pusat diantaranya kampus UBSI
                wilayah BSD, Cengkareng, Cimone, Cikarang, Cutmutia, Salemba,
                dan Kaliabang
              </p>
            </div>
          </li>

          <li className="relative mb-6 sm:mb-0 md:w-[33%]">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full ring-0 ring-whit shrink-0">
                <svg
                  className="w-4 h-4 color-primary "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <div className="hidden sm:flex w-full bg-primary h-[2px]"></div>
            </div>
            <div className="mt-1 sm:pe-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Terbentuknya HIMSI UBSI cabang Kaliabang
              </h3>
              <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
                Created on December 2, 2006
              </time>
              <p className="font-normal text-gray-500 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                repudiandae, inventore, porro enim tempora facere rem veritatis
                nulla doloremque aspernatur consectetur hic commodi eaque
                laborum laudantium totam atque! Ea, ullam!
              </p>
            </div>
          </li>
        </ol>
      </div>

      <div className="w-full flex justify-center items-center gap-6 md:px-12 mt-16 px-6">
        <div className="w-[50%] bg-sky-300/20 flex justify-center items-center rounded-r-xl p-6 shadow-xl h-full">
          <div className="md:w-[100%]">
            <Image
              src={"/assets/static-img/team-call.svg"}
              width={300}
              height={300}
              alt="bph"
              className="w-full object-cover object-center"
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <span className="text-lg font-bold color-primary">HIMSI</span>
          <span className="text-4xl font-bold font-sans opacity-95">
            BPH DPC Kaliabang
          </span>
          <p className="text-base font-normal text-slate-700 mt-6">
            Badan Pengurus Harian (BPH) adalah kelompok inti dalam organisasi
            yang bertanggung jawab atas pengelolaan dan koordinasi kegiatan
            sehari-hari. BPH terdiri dari pemimpin utama organisasi, seperti
            ketua, wakil ketua, sekretaris, bendahara, serta beberapa divisi
            lainnya yang mendukung operasional organisasi.
          </p>
          <ol className="mt-6 flex flex-col gap-6 font-sans">
            <li className="flex items-start gap-3">
              <span className="mt-1">
                <ImBullhorn className="text-lg color-primary" />
              </span>
              <div className="text-base text-slate-700">
                <span className="text-black font-bold">Visi. </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
                aliquam laboriosam ut odit nulla perferendis dolorem. Earum ad
                placeat quibusdam harum cumque repellat ex quisquam sapiente,
                unde praesentium!
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1">
                <ImBullhorn className="text-lg color-primary" />
              </span>
              <div className="text-base text-slate-700">
                <span className="text-black font-bold">Misi. </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
                aliquam laboriosam ut odit nulla perferendis dolorem. Earum ad
                placeat quibusdam harum cumque repellat ex quisquam sapiente,
                unde praesentium!
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div className="px-6 md:px-12 flex flex-col justify-center items-center mt-16">
        <div className="mb-1">
          <span className="flex justify-center items-center font-semibold text-2xl">
            Our division
          </span>
        </div>
        <div className=" md:px-16 px-8 w-full bg-[#f5f5f5] py-6 rounded-2xl">
          <div className="w-full grid grid-cols-2 rounded-xl bg-white overflow-hidden border border-slate-200 shadow-md">
            <Link
              href="/"
              className="w-full h-60 border border-slate-200 rounded-tl-xl flex flex-col justify-between items-start md:p-6 relative"
            >
              <div className="w-full h-full absolute top-0 left-0 opacity-5">
                <Image
                  src={"/assets/static-img/pendidikan-background.jpg"}
                  width={500}
                  height={500}
                  alt="pendidikan background"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="w-11 h-11 flex justify-center items-center bg-sky-200/30 rounded-lg">
                  <GiOwl className="text-xl text-amber-800" />
                </span>
                <span className="group">
                  <PiArrowBendRightUpThin className="text-slate-300 text-4xl group-hover:text-slate-500 " />
                </span>
              </div>
              <div className="flex flex-col gap-1 justify-center items-start">
                <span className="font-bold text-black/90">Pendidikan</span>
                <p className="text-sm font-sarif font-normal text-slate-600">
                  Divisi Pendidikan memberikan bimbingan sesuai dengan mata
                  kuliah yang di terapkan dikelas, memberikan bimbingan terkait
                  Aplikasi yang dapat menambah kreatifitas dan Soft Skill
                  mahasiswa, menciptakan jiwa kompetitif di kalangan mahasiswa.
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="w-full h-60 border border-slate-200 rounded-tr-xl flex flex-col justify-between items-start md:p-6 relative"
            >
              <div className="w-full h-full absolute top-0 left-0 opacity-5">
                <Image
                  src={"/assets/static-img/litbang-background.jpg"}
                  width={500}
                  height={500}
                  alt="pendidikan background"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="w-11 h-11 flex justify-center items-center bg-sky-200/30 rounded-lg">
                  <GiDolphin className="text-2xl text-sky-600" />
                </span>
                <span className="group">
                  <PiArrowBendRightUpThin className="text-slate-300 text-4xl group-hover:text-slate-500 " />
                </span>
              </div>
              <div className="flex flex-col gap-1 justify-center items-start">
                <span className="font-bold text-black/90">Litbang</span>
                <p className="text-sm font-sarif font-normal text-slate-600">
                  Divisi Litbang divisi yang melaksanakan fungsi penelitian dan
                  pengembangan serta kegiatan yang bersifat sosial dengan
                  mengedepankan sistem informasi.
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="w-full h-60 border border-slate-200 rounded-bl-xl flex flex-col justify-between items-start md:p-6 relative"
            >
              <div className="w-full h-full absolute top-0 left-0 opacity-5">
                <Image
                  src={"/assets/static-img/rsdm-background.jpg"}
                  width={500}
                  height={500}
                  alt="pendidikan background"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="w-11 h-11 flex justify-center items-center bg-sky-200/30 rounded-lg">
                  <GiAnt className="text-2xl text-black" />
                </span>
                <span className="group">
                  <PiArrowBendRightUpThin className="text-slate-300 text-4xl group-hover:text-slate-500 " />
                </span>
              </div>
              <div className="flex flex-col gap-1 justify-center items-start">
                <span className="font-bold text-black/90">Rsdm</span>
                <p className="text-sm font-sarif font-normal text-slate-600">
                  Divisi RSDM ( Rekrutmen Sumber Daya Manusia ) merupakan salah
                  satu divisi dari keempat divisi yang ada di struktur HIMSI,
                  divisi RSDM dengan tujuan utama mengevaluasi ke anggotaan,
                  kegiatan internal DPC, dan tupoksi dari keseluruhan struktur
                  DPC HIMSI.
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="w-full h-60 border border-slate-200 rounded-bl-xl flex flex-col justify-between items-start md:p-6 relative"
            >
              <div className="w-full h-full absolute top-0 left-0 opacity-5">
                <Image
                  src={"/assets/static-img/kominfo-background.jpg"}
                  width={500}
                  height={500}
                  alt="pendidikan background"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="w-11 h-11 flex justify-center items-center bg-sky-200/30 rounded-lg">
                  <GiWolfHowl className="text-2xl text-gray-500" />
                </span>
                <span className="group">
                  <PiArrowBendRightUpThin className="text-slate-300 text-4xl group-hover:text-slate-500 " />
                </span>
              </div>
              <div className="flex flex-col gap-1 justify-center items-start">
                <span className="font-bold text-black/90">Kominfo</span>
                <p className="text-sm font-sarif font-normal text-slate-600">
                  Divisi kominfo (Komunikasi dan Informasi) adalah Divisi yang
                  memiliki tanggung jawab dalam hal komunikasi (humas) sebagai
                  penghubung internal ke eksternal himsi ataupun sebaliknya.
                  Selain itu mempunyai Tanggung jawab dalam pengelolaan sosial
                  media HIMSI UBSI.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:px-12 px-6 mt-16">
        <div className="w-full shadow-md h-[26rem] relative rounded-3xl overflow-hidden">
          <div className="relative w-full h-full">
            {/* Background Image */}
            <Image
              src={"/assets/static-img/hsc.jpg"}
              width={2000}
              height={2000}
              alt="pendidikan background"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-[40%]"
            />

            <Image
              src={"/assets/static-img/garudaPDL.png"}
              width={2000}
              height={2000}
              alt="pendidikan background"
              className="absolute w-16 top-5 right-5 opacity-100 brightness-200"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-purple-900/40 flex justify-center items-center flex-col">
              <h1 className="text-4xl font-bold text-white font-sans">
                We are HIMSI!
              </h1>
              <span className="text-sm font-medium text-white opacity-60">
                HIMSI HSC&HST 2024
              </span>
              <span className="text-lg font-semibold text-white opacity-80">
                Lebih dari 43 Anggota HIMSI KLA ikut dalam kegiatan.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-slate-950 w-full md:px-12 px-6 py-24 relative">
        <div className="w-full bg-white/10 backdrop-blur-3xl rounded-3xl z-20 text-white px-8 py-16 flex justify-between items-center gap-16">
          <div className="w-96 max-h-[26rem] rounded-2xl overflow-hidden">
            <Image
              src="/assets/static-img/oprec-benner.jpg"
              width={1000}
              height={1000}
              alt="himsi lpko"
              className="w-full h-full object-fill object-center brightness-[175%] contrast-[110%]"
            />
          </div>
          <div className="flex-1 flex flex-col h-full z-20">
            <h1
              className={`${inter.className} text-5xl font-semibold font-sans tracking-tighter`}
            >
              Join our team
            </h1>
            <span className="opacity-80 text-base mt-4 font-normal">
              Especially for information system students of Bina Sarana
              Informatika Kaliabang, meet us in September at the open
              recruitment event.
            </span>
            <div className="grid grid-cols-2 mt-12 gap-y-8">
              <div className="flex gap-2 items-center">
                <span className="w-6 h-6 flex justify-center items-center bg-white/80 rounded-full">
                  <FaNetworkWired className="text-sm text-slate-600" />
                </span>
                <span className={`${inter.className} text-sm`}>
                  4 program kerja
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-6 h-6 flex justify-center items-center bg-white/80 rounded-full">
                  <FaPeopleGroup className="text-sm text-slate-600" />
                </span>
                <span className={`${inter.className} text-sm`}>
                  56 Anggota HIMSI KLA
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-6 h-6 flex justify-center items-center bg-white/80 rounded-full">
                  <FaPeopleCarry className="text-sm text-slate-600" />
                </span>
                <span className={`${inter.className} text-sm`}>
                  Lebih dari 11 kegiatan
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-6 h-6 flex justify-center items-center bg-white/80 rounded-full">
                  <HiAcademicCap className="text-sm text-slate-600" />
                </span>
                <span className={`${inter.className} text-sm`}>
                  4 Divisi saling berkolaborasi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute w-full h-full bg-radial-[at_25%_25%] from-white via-black to-zinc-100 to-75% top-0 left-0 opacity-10"></div>
      </div>

      <div className="w-full my-32 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col items-start justify-start">
          <h1 className="text-4xl font-bold font-sarif opacity-90">
            Frequently asked questions
          </h1>
          <div className="flex flex-col items-start justify-start w-full mt-10">
            <div
              className="flex flex-col items-start justify-start w-full py-6 border-b border-slate-300 cursor-pointer"
              onClick={() => setFirstFaq(!firstFaq)}
            >
              <div className="w-full flex justify-between items-center">
                <span
                  className={`${inter.className} font-semibold text-base font-sans opacity-95`}
                >
                  Apakah harus punya basic programing untuk bergabung HIMSI?
                </span>
                <FiPlus className="text-xl opacity-95" />
              </div>
              <div
                className={`w-full opacity-70 text-sm font-normal mt-4 ${
                  firstFaq ? "block" : "hidden"
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
                nostrum eaque quae modi ad sapiente impedit fugiat sequi, iusto
                magni?
              </div>
            </div>

            <div
              className="flex flex-col items-start justify-start w-full py-6 border-b border-slate-300 cursor-pointer"
              onClick={() => setTwoFaq(!twoFaq)}
            >
              <div className="w-full flex justify-between items-center">
                <span
                  className={`${inter.className} font-semibold text-base font-sans opacity-95`}
                >
                  Apakah maba(Mahasiswa baru) bisa bergabung?
                </span>
                <FiPlus className="text-xl opacity-95" />
              </div>
              <div
                className={`w-full opacity-70 text-sm font-normal mt-4 ${
                  twoFaq ? "block" : "hidden"
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
                nostrum eaque quae modi ad sapiente impedit fugiat sequi, iusto
                magni?
              </div>
            </div>

            <div
              className="flex flex-col items-start justify-start w-full py-6 border-b border-slate-300 cursor-pointer"
              onClick={() => setThreeFaq(!threeFaq)}
            >
              <div className="w-full flex justify-between items-center">
                <span
                  className={`${inter.className} font-semibold text-base font-sans opacity-95`}
                >
                  Benefit apa yang di dapatkan jika bergabung?
                </span>
                <FiPlus className="text-xl opacity-95" />
              </div>
              <div
                className={`w-full opacity-70 text-sm font-normal mt-4 ${
                  threeFaq ? "block" : "hidden"
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
                nostrum eaque quae modi ad sapiente impedit fugiat sequi, iusto
                magni?
              </div>
            </div>

            <div
              className="flex flex-col items-start justify-start w-full py-6 border-b border-slate-300 cursor-pointer"
              onClick={() => setFourFaq(!fourFaq)}
            >
              <div className="w-full flex justify-between items-center">
                <span
                  className={`${inter.className} font-semibold text-base font-sans opacity-95`}
                >
                  Mahsiswa kelas malem bisa bergabung?
                </span>
                <FiPlus className="text-xl opacity-95" />
              </div>
              <div
                className={`w-full opacity-70 text-sm font-normal mt-4 ${
                  fourFaq ? "block" : "hidden"
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
                nostrum eaque quae modi ad sapiente impedit fugiat sequi, iusto
                magni?
              </div>
            </div>

            <div
              className="flex flex-col items-start justify-start w-full py-6 border-b border-slate-300 cursor-pointer"
              onClick={() => setFiveFaq(!fiveFaq)}
            >
              <div className="w-full flex justify-between items-center">
                <span
                  className={`${inter.className} font-semibold text-base font-sans opacity-95`}
                >
                  Berapa lama masa jabatan dalam HIMSI KLA?
                </span>
                <FiPlus className="text-xl opacity-95" />
              </div>
              <div
                className={`w-full opacity-70 text-sm font-normal mt-4 ${
                  fiveFaq ? "block" : "hidden"
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit
                nostrum eaque quae modi ad sapiente impedit fugiat sequi, iusto
                magni?
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
