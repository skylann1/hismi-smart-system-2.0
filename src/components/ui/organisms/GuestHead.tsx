"use client";

import React, { useState, useEffect, useRef } from "react";
import { oswald } from "@/app/fonts";
import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface Division {
  name: string;
  href: string;
}

export default function GuestHead() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const divisions: Division[] = [
    { name: "BPI (Badan Pengurus Inti)", href: "/divisi/bpi" },
    { name: "PSDM (Pengembangan Sumber Daya Mahasiswa)", href: "/divisi/psdm" },
    { name: "Kominfo (Komunikasi dan Informasi)", href: "/divisi/kominfo" },
    { name: "Ristek (Riset dan Teknologi)", href: "/divisi/ristek" },
    { name: "Kewirausahaan", href: "/divisi/kewirausahaan" },
    { name: "Sosial Masyarakat", href: "/divisi/sosmas" },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full max-w-7xl sticky top-0 md:px-12 px-6 z-[9999] bg-white/95">
      <div className="flex justify-between items-center border-b border-slate-200 py-4 bg-slate">
        <Link href={"/introduction"} className="flex flex-col items-start">
          <div className="flex gap-2 items-center">
            <span
              className={`${oswald.className} text-2xl font-bold color-primary`}
            >
              HIMSI KLA
            </span>
            <span className="w-6">
              <Image
                src="/assets/static-img/logo.png"
                width={500}
                height={500}
                alt="logo"
              />
            </span>
          </div>
          <span className={`text-xs font-normal opacity-70`}>
            Himpunan Mahasiswa Sistem Informasi
          </span>
        </Link>

        <nav>
          <ul className="flex space-x-6 font-medium text-sm items-center">
            <li className="">
              <Link href={"/"}>Galeri</Link>
            </li>

            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-label="Toggle menu Divisi"
              >
                Divisi
                <MdKeyboardArrowDown
                  className={`text-xl ml-1 transform transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-2 z-50 border border-slate-100">
                  {divisions.map((divisi) => (
                    <Link
                      key={divisi.name}
                      href={divisi.href}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {divisi.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li>
              <Link href={"/"}>BPH</Link>
            </li>
            <li>
              <Link href={"/news"}>News</Link>
            </li>
            <li>
              <button 
              onClick={() => signIn()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
                Masuk
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
