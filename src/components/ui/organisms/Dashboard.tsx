"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LuNotebookPen } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { IoIosPeople, IoIosAlbums, IoIosSettings } from "react-icons/io";
import { FaBarsProgress } from "react-icons/fa6";
import { MdConnectWithoutContact } from "react-icons/md";
import { FaAddressBook, FaBusinessTime } from "react-icons/fa";
import Image from "next/image";
import { FaAssistiveListeningSystems } from "react-icons/fa";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/hooks/redux";
import { ROLES, hasAccess } from "@/lib/roles";
import { FaPersonDotsFromLine } from "react-icons/fa6";
import { SiSmart } from "react-icons/si";

type DashboardPropsType = {
  children: React.ReactNode[] | React.ReactElement[];
};

export default function Dashboard({ children }: DashboardPropsType) {
  const dispacth = useAppDispatch();
  interface CustomUser extends Record<string, unknown> {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  const { data: session } = useSession();
  const user = session?.user as CustomUser;

  const userRoles = (user?.access as string[]) || [];
  useEffect(() => {
    const getDataUser = async () => {
      try {
        if (user) {
          const res = await fetch(`/dashboard/api/anggota?id=${user.id}`);
          const data = await res.json();
          console.log(data)

          if (data.success) {
            dispacth({
              type: "user/setUser",
              payload: data.data,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    getDataUser();
  }, [session, dispacth, user]);

  const [isOpen, setIsOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notulenDrop, setNotulenDrop] = useState(false);
  const [pertemuanDrop, setPertemuanDrop] = useState(false);
  const [anggotaDrop, setAnggotaDrop] = useState(false);
  const [kehadiranDrop, setKehadiranDrop] = useState(false);
  const [publikasiDrop, setPublikasiDrop] = useState(false);
  const [prokerDrop, setProkerDrop] = useState(false);
  const [kegiatanDrop, setKegiatanDrop] = useState(false);
  const [pemiluDrop, setPemiluDrop] = useState(false);
  const [settingsDrop, setSettingsDrop] = useState(false);
  const [settingsPemiluDrop, setSettingsPemiluDrop] = useState(false);
  // state for date
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

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

  // update state for realtime date or time
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

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
              <div className="md:flex justify-center items-center hidden">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/assets/static-img/logo-himsi.png"
                    alt="HIMSI Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                  <span className="text-lg font-extrabold text-gray-900">SMART SYSTEMS</span>
                </div>
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
                    <p className="text-sm text-gray-900">{user?.name || "User"}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email || ""}
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
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <button
                        onClick={() =>
                          signOut({ callbackUrl: "/member/login" })
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
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
        className={`fixed top-0 left-0 z-40 w-full sm:w-64 h-screen pt-14 transition-transform  bg-black/30 sm:-translate-x-0 shadow-right ${sideBar ? "-translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Sidebar"
        onClick={(e) => handleClickOutside(e)}
      >
        <div className="w-64 h-full px-3 pb-4 overflow-y-auto pt-6 bg-white">
          <ul className="space-y-2 font-medium">
            {
              !userRoles.includes(ROLES.GUEST) && (
                <>
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
                    <Link
                      href="/dashboard/mendatang"
                      className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                    >
                      <FaBusinessTime className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                      <span className="ms-3 font-inter-medium">Mendatang</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/dashboard/rekap-absensi"
                      className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                    >
                      <LuNotebookPen className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                      <span className="ms-3 font-inter-medium">Rekap Absensi</span>
                    </Link>
                  </li>
                </>
              )
            }

            {/* editor anggota */}
            {hasAccess(userRoles, [
              ROLES.KOORDINATOR,
              ROLES.KETUA_WAKIL,
              ROLES.SETTINGS,
            ]) && (
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
                      className={`w-3 h-3 transition-transform ${anggotaDrop ? "rotate-180" : "rotate-0"
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
                    className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${anggotaDrop ? "block" : "hidden"
                      }`}
                  >
                    <li>
                      <Link
                        href="/dashboard/anggota"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        List anggota
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/anggota/tambah"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Tambah anggota
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

            {/* editor pertemuan/rapat */}
            {hasAccess(userRoles, [
              ROLES.KETUA_WAKIL,
              ROLES.SETTINGS,
              ROLES.SEKRETARIS,
              ROLES.KOORDINATOR,
            ]) && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setPertemuanDrop(!pertemuanDrop);
                    }}
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
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
                      Pertemuan
                    </span>

                    <svg
                      className={`w-3 h-3 transition-transform ${pertemuanDrop ? "rotate-180" : "rotate-0"
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
                    className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${pertemuanDrop ? "block" : "hidden"
                      }`}
                  >
                    <li>
                      <Link
                        href="/dashboard/pertemuan"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        pertemuan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/pertemuan/tambah"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Tambah pertemuan
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            {/* PUBLIKASI KOMINFO */}
            {hasAccess(userRoles, [ROLES.PUBLIKASI, ROLES.SETTINGS]) && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setPublikasiDrop(!publikasiDrop);
                  }}
                  className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
                >
                  <FaAssistiveListeningSystems className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                    Publikasi
                  </span>

                  <svg
                    className={`w-3 h-3 transition-transform ${publikasiDrop ? "rotate-180" : "rotate-0"
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
                  className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${publikasiDrop ? "block" : "hidden"
                    }`}
                >
                  <li>
                    <Link
                      href="/dashboard/publikasi/divisi"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                    >
                      Divisi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/publikasi/bph"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                    >
                      BPH
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/publikasi/artikel"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                    >
                      artikel
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/publikasi/galeri"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                    >
                      Galeri
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* ALBUM FOTO */}
            {
              !userRoles.includes(ROLES.GUEST) && (
                <li>
                  <Link
                    href="/dashboard/album-foto"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                  >
                    <IoIosAlbums className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                    <span className="ms-3 font-inter-medium">Album foto</span>
                  </Link>
                </li>
              )
            }

            {/* NOTULENSI */}
            {hasAccess(userRoles, [
              ROLES.SEKRETARIS,
              ROLES.KETUA_WAKIL,
              ROLES.SETTINGS,
            ]) && (
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
                      className={`w-3 h-3 transition-transform ${notulenDrop ? "rotate-180" : "rotate-0"
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
                    className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${notulenDrop ? "block" : "hidden"
                      }`}
                  >
                    <li>
                      <Link
                        href="/dashboard/notulensi"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        List notulensi
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/notulensi/tambah"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Tambah notulensi
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

            {/* KEUANGAN BENDAHAR*/}
            {hasAccess(userRoles, [
              ROLES.BENDAHARA,
              ROLES.KETUA_WAKIL,
              ROLES.SETTINGS,
            ]) && (
                <li>
                  <Link
                    href="/dashboard/keuangan"
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                  >
                    <GrMoney className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                    <span className="ms-3 font-inter-medium">Keuangan</span>
                  </Link>
                </li>
              )}

            {/* PROKER UNTUK KOORDINATOR DAN BPH */}
            {hasAccess(userRoles, [
              ROLES.KOORDINATOR,
              ROLES.KETUA_WAKIL,
              ROLES.SETTINGS,
            ]) && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setProkerDrop(!prokerDrop);
                    }}
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
                  >
                    <FaBarsProgress className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                      Proker
                    </span>

                    <svg
                      className={`w-3 h-3 transition-transform ${prokerDrop ? "rotate-180" : "rotate-0"
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
                    className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${prokerDrop ? "block" : "hidden"
                      }`}
                  >
                    <li>
                      <Link
                        href="/dashboard/proker"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        List proker
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/proker/tambah"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Tambah proker
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

            {/* KEGIATAN UNTUK KOORD DAN KETUM */}
            {hasAccess(userRoles, [
              ROLES.KOORDINATOR,
              ROLES.KETUA_WAKIL,
              ROLES.SETTINGS,
            ]) && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setKegiatanDrop(!kegiatanDrop);
                    }}
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
                  >
                    <MdConnectWithoutContact className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                      Kegiatan
                    </span>

                    <svg
                      className={`w-3 h-3 transition-transform ${kegiatanDrop ? "rotate-180" : "rotate-0"
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
                    className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${kegiatanDrop ? "block" : "hidden"
                      }`}
                  >
                    <li>
                      <Link
                        href="/dashboard/kegiatan"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        List kegiatan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/kegiatan/tambah"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Tambah kegiatan
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

            {/* KEHADIRAN UNTUK RSDM & EDITOR ABSENSI */}
            {hasAccess(userRoles, [
              ROLES.EDITOR_ABSENSI,
              ROLES.SETTINGS,
            ]) && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setKehadiranDrop(!kehadiranDrop);
                    }}
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
                  >
                    <FaAddressBook className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                      Kehadiran
                    </span>

                    <svg
                      className={`w-3 h-3 transition-transform ${kehadiranDrop ? "rotate-180" : "rotate-0"}`}
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
                    className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${kehadiranDrop ? "block" : "hidden"
                      }`}
                  >
                    {/* Menu khusus admin/editor absensi */}
                    <li>
                      <Link
                        href="/dashboard/kehadiran"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Kehadiran anggota
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/kehadiran/absen"
                        className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                      >
                        Absen
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

            {/* SETTING KONFIGURASI */}
            {hasAccess(userRoles, [ROLES.SETTINGS]) && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsDrop(!settingsDrop);
                  }}
                  className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
                >
                  <IoIosSettings className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                    settings
                  </span>

                  <svg
                    className={`w-3 h-3 transition-transform`}
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
                  className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${settingsDrop ? "block" : "hidden"
                    }`}
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => setSettingsPemiluDrop(!settingsPemiluDrop)}
                      className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100 cursor-pointer"
                    >
                      <span className="flex-1 text-left whitespace-nowrap">
                        Pemilu
                      </span>

                      <svg
                        className={`w-3 h-3 mr-2 transition-transform duration-200 ${settingsPemiluDrop ? "rotate-180" : ""
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
                      className={`py-1 space-y-1 transition-all duration-200 ${settingsPemiluDrop ? "block" : "hidden"
                        }`}
                    >
                      <li>
                        <Link
                          href="/dashboard/settings/pemilu/konfiguration"
                          className="flex items-center w-full p-2 text-sm text-gray-700 transition duration-200 rounded-lg pl-16 group hover:bg-gray-100 hover:text-blue-600"
                        >
                          Konfigurasi
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/dashboard/settings/pemilu/kandidat"
                          className="flex items-center w-full p-2 text-sm text-gray-700 transition duration-200 rounded-lg pl-16 group hover:bg-gray-100 hover:text-blue-600"
                        >
                          Kandidat
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/dashboard/settings/pemilu/stats" // Sesuaikan path voting lu
                          className="flex items-center w-full p-2 text-sm text-gray-700 transition duration-200 rounded-lg pl-16 group hover:bg-gray-100 hover:text-blue-600"
                        >
                          Stats
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link
                      href="/dashboard/server"
                      className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                    >
                      server
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* VOTTING TIME */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setPemiluDrop(!pemiluDrop);
                }}
                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-200 rounded-lg group hover:bg-gray-100 cursor-pointer"
              >
                <FaPersonDotsFromLine className="shrink-0 w-5 h-5 text-gray-500 transition duration-75" />

                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap font-inter-medium">
                  Pemilu
                </span>

                <svg
                  className={`w-3 h-3 transition-transform`}
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
                className={`py-2 space-y-2 transition-all duration-200 font-inter-medium ${pemiluDrop ? "block" : "hidden"
                  }`}
              >
                <li>
                  <Link
                    href="/dashboard/pemilu/votes"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Votes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/pemilu/result"
                    className="flex items-center w-full p-2 text-gray-900 transition duration-200 rounded-lg pl-11 group hover:bg-gray-100 opacity-80 hover:opacity-100"
                  >
                    Real count
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div >
      </aside >

      <div className=" sm:ml-64 pt-[69px] pb-10 bg-[#f2f2f2] min-h-screen relative overflow-hidden">
        <div className="w-full bg-white border-b-[1.2px] border-slate-200 text-black px-4 md:px-6 py-3 shadow-lg text-[13px] flex justify-between items-center z-50">
          <span className="opacity-60 font-normal">
            Himpunan Mahasiswa Sistem Informasi.
          </span>
          <span className="ms-2 opacity-60 font-normal text-xs hidden md:block">
            {!currentDate
              ? "Loading date..."
              : currentDate.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
