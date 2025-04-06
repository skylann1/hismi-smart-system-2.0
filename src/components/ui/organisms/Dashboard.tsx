"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { RiDiscussFill } from "react-icons/ri";
import { LuNotebookPen } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { IoIosPeople, IoIosAlbums } from "react-icons/io";
import { FaBarsProgress } from "react-icons/fa6";
import { MdConnectWithoutContact } from "react-icons/md";
import { FaAddressBook, FaBusinessTime } from "react-icons/fa";
import { IoScanCircle } from "react-icons/io5";
import Image from "next/image";
import { inter } from "@/app/fonts";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [acaraDrop, setAcaraDrop] = useState(false);
  const [pertemuanDrop, setPertemuanDrop] = useState(false);
  const [notulenDrop, setNotulenDrop] = useState(false);
  const [keuanganDrop, setKeuanganDrop] = useState(false);
  const [anggotaDrop, setAnggotaDrop] = useState(false);
  const [kehadiranDrop, setKehadiranDrop] = useState(false);
  const [absenDrop, setAbsenDrop] = useState(false);
  const [mendatangDrop, setMendatangDrop] = useState(false);

  const toggleAcaraDrop = () => {
    setAcaraDrop(!acaraDrop);
  };
  const togglePertemuanDrop = () => {
    setPertemuanDrop(!pertemuanDrop);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (sideBar) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [sideBar]);

  const handleClickOutside = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).id === "overlay-sidebar") {
      // console.log(e.target.id);
      setSideBar(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSideBar(!sideBar);
                }}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200  "
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <div className="flex justify-center items-center">
                <span className={`${inter.className} text-base font-semibold`}>Learn, lead, connect.</span>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center text-sm bg-gray-100 rounded-full focus:ring-4 focus:ring-gray-300"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="w-11 h-11 rounded-full"
                  src="/assets/static-img/female.svg"
                  alt="user photo"
                  height={1000}
                  width={1000}
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">Sahlan muzaqi</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      shlnmzqlocko@gmail.com
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="overlay-sidebar"
        className={`fixed top-0 left-0 z-40 w-full sm:w-64 h-screen pt-14 transition-transform bg-opacity-10 border-r bg-white sm:-translate-x-0 ${
          sideBar ? "-translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
        onClick={(e) => handleClickOutside(e)}
      >
        <div className="w-64 h-full px-3 pb-4 overflow-y-auto bg-white pt-6">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75   "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3 font-inter-medium">Dashboard</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setMendatangDrop(!mendatangDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <FaBusinessTime className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Mendatang
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    mendatangDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  mendatangDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="/dashboard/acara/mendatang"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Acara
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/pertemuan/mendatang"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Pertemuan
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setAnggotaDrop(!anggotaDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <IoIosPeople className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Anggota
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    anggotaDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  anggotaDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="/dashboard/list-anggota"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    List anggota
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/tambah-anggota"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Tambah anggota
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                type="button"
                onClick={toggleAcaraDrop}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <svg
                  className="shrink-0 w-5 h-5 text-gray-500 transition duration-75"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Acara
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    acaraDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  acaraDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    List acara
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Tambah acara
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                type="button"
                onClick={togglePertemuanDrop}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <RiDiscussFill className=" shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Pertemuan
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    pertemuanDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  pertemuanDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    List pertemuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Tambah pertemuan
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <IoIosAlbums className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                <span className="ms-3 font-inter-medium">Album foto</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setNotulenDrop(!notulenDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <LuNotebookPen className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Notulensi
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    notulenDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  notulenDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    List notulensi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Tambah notulensi
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setKeuanganDrop(!keuanganDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <GrMoney className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  keuangan
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    keuanganDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  keuanganDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Data kas
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Data pemasukan
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Data pengeluaran
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <FaBarsProgress className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                <span className="ms-3 font-inter-medium">Proker</span>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <MdConnectWithoutContact className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                <span className="ms-3 font-inter-medium">Kegiatan</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setKehadiranDrop(!kehadiranDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <FaAddressBook className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Kehadiran
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    keuanganDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  kehadiranDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Kehadiran acara
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Kehadiran pertemuan
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setAbsenDrop(!absenDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 "
              >
                <IoScanCircle className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Absensi
                </span>

                <svg
                  className={`w-3 h-3 transition-transform ${
                    absenDrop ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <ul
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${
                  absenDrop ? "block" : "hidden"
                }`}
              >
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    data absen
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Scan QR
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64 pt-20 pb-10 bg-[#f2f2f2] min-h-screen">{children}</div>
    </>
  );
}
