"use client";

import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleClickBack = () => {
    router.back();
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-6 py-6 lg:px-10 lg:py-16">
      <div className="bg-white w-full h-full flex flex-col lg:flex-row justify-center items-center rounded-xl gap-x-16 gap-y-4">
        <div className="w-56">
          <Image
            className="w-full objecyt-cover object-center"
            width={1000}
            height={1000}
            alt="not found"
            src={"/assets/undraw/page-eaten.svg"}
          />
        </div>
        <div className="flex items-start flex-col">
          <div className="flex items-center justify-center gap-0.5">
            <h2 className={` font-bold text-6xl text-gray-800`}>Oops!</h2>
            <div className="w-32 mb-4">
              <Image
                className="w-full object-cover object-center"
                width={1000}
                height={1000}
                alt="not found"
                src={"/assets/animation/404.gif"}
              />
            </div>
          </div>
          <p className="font-medium text-gray-600 text-sm max-w-72">
            The page you are looking for is not found. by clicking the button
            below you can go back.
          </p>

          <div className="w-full flex justify-end">
            <button
              className="bg-primary text-white font-medium text-base mt-8 flex justify-center items-center px-2 py-1 rounded-md gap-1 cursor-pointer"
              onClick={handleClickBack}
            >
              <MdArrowBackIos className="text-xs" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
