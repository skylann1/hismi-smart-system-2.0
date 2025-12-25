"use client";

import React, { useState, useEffect, useRef } from "react";
import { oswald } from "@/app/fonts";
import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface Division {
  name: string;
  href: string;
}

export default function GuestHead() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const divisions: Division[] = [
    { name: "BPI (Badan Pengurus Inti)", href: "/division/bpi" },
    { name: "PSDM (Pengembangan Sumber Daya Mahasiswa)", href: "/division/psdm" },
    { name: "Kominfo (Komunikasi dan Informasi)", href: "/division/kominfo" },
    { name: "Ristek (Riset dan Teknologi)", href: "/division/ristek" },
    { name: "Kewirausahaan", href: "/division/kewirausahaan" },
    { name: "Sosial Masyarakat", href: "/division/sosmas" },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

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
                src="/assets/static-img/logo-himsi.png"
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

        <nav className="hidden md:block">
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
                  className={`text-xl ml-1 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-slate-800"
          onClick={toggleMobileMenu}
          aria-label="Open mobile menu"
        >
          <HiMenuAlt3 />
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          onClick={toggleMobileMenu}
        />

        {/* Mobile Menu Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[10001] shadow-2xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <span className={`${oswald.className} text-xl font-bold color-primary`}>HIMSI Menu</span>
              <button onClick={toggleMobileMenu} className="text-2xl text-slate-500 hover:text-red-500 transition-colors">
                <IoClose />
              </button>
            </div>

            <ul className="flex flex-col space-y-4 font-medium text-base overflow-y-auto">
              <li>
                <Link href={"/"} onClick={toggleMobileMenu} className="block py-2 border-b border-slate-50">Galeri</Link>
              </li>

              <li className="py-2 border-b border-slate-50">
                <span className="block mb-2 text-slate-500 text-xs uppercase tracking-wider">Divisi</span>
                <div className="flex flex-col space-y-3 pl-4">
                  {divisions.map((divisi) => (
                    <Link
                      key={divisi.name}
                      href={divisi.href}
                      className="text-slate-700 hover:text-blue-600"
                      onClick={toggleMobileMenu}
                    >
                      {divisi.name}
                    </Link>
                  ))}
                </div>
              </li>

              <li>
                <Link href={"/"} onClick={toggleMobileMenu} className="block py-2 border-b border-slate-50">BPH</Link>
              </li>
              <li>
                <Link href={"/news"} onClick={toggleMobileMenu} className="block py-2 border-b border-slate-50">News</Link>
              </li>

              <li className="mt-auto pt-8">
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    signIn();
                  }}
                  className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex justify-center items-center shadow-lg shadow-blue-200">
                  Masuk / Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
