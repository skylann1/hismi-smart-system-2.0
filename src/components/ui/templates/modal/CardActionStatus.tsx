import { FaCircleCheck } from "react-icons/fa6";
import { RiErrorWarningFill } from "react-icons/ri";
import { inter } from "@/app/fonts";

export default function CardActionStatus({
  onClick,
  title,
  message,
  status,
  buttonActionTitle,
}: {
  onClick: () => void;
  title: string;
  message: string;
  status: boolean;
  buttonActionTitle: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-0 w-78 lg:w-96 overflow-hidden">
      <div className="">
        {status ? (
          <div className="p-3 bg-green-300/5 rounded-full">
            <div className="p-3 bg-green-300/15 rounded-full">
              <div className="p-3 bg-green-300/25 rounded-full">
                <div className="p-3 bg-green-300/35 rounded-full">
                  <div className="bg-white rounded-full">
                    <FaCircleCheck className="text-4xl object-center object-cover text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-red-300/5 rounded-full">
            <div className="p-3 bg-red-300/15 rounded-full">
              <div className="p-3 bg-red-300/25 rounded-full">
                <div className="p-3 bg-red-300/35 rounded-full">
                  <div className="bg-white rounded-full">
                    <RiErrorWarningFill className="text-4xl object-center object-cover text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <h2 className={`${inter.className} font-semibold text-xl text-gray-800`}>{title}</h2>
      <p className="max-w-sm text-gray-500 text-center text-sm">{message}</p>
      <button
        onClick={onClick}
        className="mt-6 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition w-full py-2 font-semibold text-base cursor-pointer"
      >
        {buttonActionTitle}
      </button>
    </div>
  );
}
