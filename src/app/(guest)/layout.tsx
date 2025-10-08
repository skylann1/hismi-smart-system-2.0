import GuestHead from "@/components/ui/organisms/GuestHead";
import GuestFooter from "@/components/ui/organisms/GuestFooter";
import { inter } from "../fonts";
// import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} w-full min-h-screen relative `}>
      <div className="w-full flex justify-between items-center md:px-12 px-6 py-1">
        {/* <span className="w-6">
          <Image
            src="/assets/static-img/logo.png"
            width={500}
            height={500}
            alt="logo"
          />
        </span> */}
        <span className="text-xs font-medium opacity-80">Team development 2025.</span>
        <div className="flex gap-2 items-center">
          <span className="text-xs font-medium opacity-80">Pendidikan</span>
          <span className="text-xs font-medium opacity-80">|</span>
          <span className="text-xs font-medium opacity-80">Kominfo</span>
        </div>
      </div>
      <GuestHead />
      {children}
      <GuestFooter />
    </div>
  );
}
