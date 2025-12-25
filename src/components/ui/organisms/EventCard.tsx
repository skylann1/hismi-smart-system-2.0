import React from "react";
import { FaSquareArrowUpRight } from "react-icons/fa6";

type EventCardProps = {
  content: {
    month: string;
    date: string;
    title: string;
    description: string;
    time: string;
    location: string;
    organizer: string;
    methodEvent: string;
    type: string;
    mapsLink?: string;
  };
  className?: string;
};

export type EventCardComponent = {
  month: string;
  date: string;
  title: string;
  description: string;
  time: string;
  location: string;
  organizer: string;
  methodEvent: string;
  type: string;
  id: string;
  mapsLink?: string;
};


const EventCard = ({ content, className }: EventCardProps) => {
  // Helper safeguards
  const safeRender = (val: unknown) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);

    return "";
  };

  return (
    <div
      className={`${className} p-4 md:p-6 flex flex-col justify-between h-[300px]`}
    >
      {/* top content */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col rounded-sm border-[1.1px] border-gray-200 w-[25%] overflow-hidden">
          <div className="flex justify-center items-center text-[10px] w-full border-b-[1.1px] border-gray-300 px-2 py-1 bg-gray-200 text-gray-700 font-bold">
            {String(safeRender(content.month)).slice(0, 3)}
          </div>
          <div className="flex justify-center items-center text-base font-extrabold px-2 py-2 bg-white text-gray-700">
            {safeRender(content.date)}
          </div>
        </div>
        <div className="flex flex-col text-xs font-semibold text-right">
          <span className="text-xs">{safeRender(content.type)} by {safeRender(content.organizer)}</span>
        </div>
      </div>

      {/* mid conntent */}
      <div className="line-clamp-3 text-lg font-semibold mt-2">
        {safeRender(content.title)}
      </div>

      {/* buttom content */}
      <div className="flex justify-between items-center relative">
        <div className="flex flex-col text-xs font-semibold">
          <h2>{safeRender(content.time)}</h2>
          <span>{safeRender(content.location)}</span>
        </div>
        <a href={safeRender(content.mapsLink)} className="group absolute top-0 right-0 p-2">
          <FaSquareArrowUpRight className="text-3xl group-hover:opacity-70 duration-200" />
        </a>
      </div>
    </div>
  );
};

export default EventCard;
