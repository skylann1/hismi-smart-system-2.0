import Image from "next/image";
import { bungee } from "@/app/fonts";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center bg-white h-screen w-full absolute z-[9999]top-0 bottom-0 left-0 right-0">
      <div className="w-36">
        <Image
          src="/assets/animation/loading.gif"
          alt="Loading..."
          width={8000}
          height={8000}
          unoptimized
          className="w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <h2 className={`text-xl font-bold text-gray-800 ${bungee.className}`}>
          Please wait.
        </h2>
        <p className="text-sm text-gray-600 font-medium">
          We are loading your content...
        </p>
      </div>
    </div>
  );
}
