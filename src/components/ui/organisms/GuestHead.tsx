import { oswald } from "@/app/fonts";
import Link from "next/link";
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";

export default function GuestHead() {
  return (
    <header className="w-full sticky top-0 md:px-12 px-6 z-50 bg-white/95">
      <div className="flex justify-between items-center border-b border-slate-200 py-4 bg-slate">
        <div className="flex flex-col items-start">
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
        </div>

        <nav>
          <ul className="flex space-x-6 font-medium text-sm">
            <li className="">
              <Link href={"/"}>About</Link>
            </li>

            <li className="relative ">
              <div className="flex items-center">
                Divisi
                <MdKeyboardArrowDown className="text-base" />
              </div>
            </li>
            <li>
              <Link href={"/"}>BPH</Link>
            </li>
            <li>
              <Link href={"/"}>News</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
