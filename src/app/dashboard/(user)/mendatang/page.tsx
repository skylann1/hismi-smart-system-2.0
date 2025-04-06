import CustomCalendar from "@/components/ui/moleculs/calendar/Calendar";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full flex flex-wrap-reverse gap-6 py-12 xl:justify-between justify-center items-center xl:items-end md:items-center">
      <div className="xl:w-fit w-full">
        <div className=" flex-col xl:flex hidden">
          <h1 className="text-4xl font-bold font-sans opacity-90 ">
            Acara & Rapat Mendatang
          </h1>
          <span className="text-base font-normal opacity-70 font-sans">
            Jangan sampai ketinggalan jadwal acara dan rapat
          </span>
        </div>
        <div className="flex flex-col items-start mt-4 w-full">
          <div className="w-full mt-3 bg-white rounded-lg shadow p-3 flex flex-col justify-between">
            <div className="w-full flex justify-between">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-xs font-semibold">2025-04-13</span>
              </div>
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 hover:underline underline-offset-1 "
              >
                More
              </Link>
            </div>
            <div className="mt-2">
              <span className="text-base font-semibold">
                Community Gathering
              </span>
              <p className="text-xs font-semibold opacity-70 mt-1">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
          <div className="w-full mt-3 bg-white rounded-lg shadow p-3 flex flex-col justify-between">
            <div className="w-full flex justify-between">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-xs font-semibold">2025-04-13</span>
              </div>
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 hover:underline underline-offset-1 "
              >
                More
              </Link>
            </div>
            <div className="mt-2">
              <span className="text-base font-semibold">
                Community Gathering
              </span>
              <p className="text-xs font-semibold opacity-70 mt-1">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
          <div className="w-full mt-3 bg-white rounded-lg shadow p-3 flex flex-col justify-between">
            <div className="w-full flex justify-between">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-xs font-semibold">2025-04-13</span>
              </div>
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 hover:underline underline-offset-1 "
              >
                More
              </Link>
            </div>
            <div className="mt-2">
              <span className="text-base font-semibold">
                Community Gathering
              </span>
              <p className="text-xs font-semibold opacity-70 mt-1">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-[30rem]">
        <div className=" flex-col xl:hidden flex mb-10">
          <h1 className="text-4xl font-bold font-sans opacity-90 ">
            Acara & Rapat Mendatang
          </h1>
          <span className="text-base font-normal opacity-70 font-sans">
            Jangan sampai ketinggalan jadwal acara dan rapat
          </span>
        </div>
        <CustomCalendar />
      </div>
    </div>
  );
}
