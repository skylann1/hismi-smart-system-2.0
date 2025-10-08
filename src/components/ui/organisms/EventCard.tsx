import React from "react";
import Link from "next/link";
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
};

const EventCard = ({ content, className }: EventCardProps) => {
  return (
    <div
      className={`${className} p-4 md:p-6 flex flex-col justify-between h-[300px]`}
    >
      {/* top content */}
      <div className="">
        <div className="flex flex-col rounded-sm border-[1.1px] border-gray-200 w-[25%] overflow-hidden">
          <div className="flex justify-center items-center text-[10px] w-full border-b-[1.1px] border-gray-300 px-2 py-1 bg-gray-200 text-gray-700 font-bold">
            {content.month.slice(0, 3)}
          </div>
          <div className="flex justify-center items-center text-base font-extrabold px-2 py-2 bg-white text-gray-700">
            {content.date}
          </div>
        </div>
      </div>

      {/* mid conntent */}
      <div className="line-clamp-3 text-lg font-semibold mt-2">
        {content.description}
      </div>

      {/* buttom content */}
      <div className="flex justify-between items-center relative">
        <div className="flex flex-col text-xs font-semibold">
          <h2>{content.time}</h2>
          <span>{content.methodEvent}</span>
        </div>
        <Link href={"/"} className="group absolute top-0 right-0 p-2">
          <FaSquareArrowUpRight className="text-3xl group-hover:opacity-70 duration-200"/>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
