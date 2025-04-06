"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

export default function CustomCalendar() {
  const [value, setValue] = useState(() => new Date());

  const currentYear = new Date().getFullYear();

  const minDate = new Date(currentYear, 0, 1);
  const maxDate = new Date(currentYear + 2, 11, 31);

  const events = [
    { date: "2025-04-13", title: "Community Gathering" },
    { date: "2025-04-18", title: "Tech Talk Day" },
    { date: "2025-04-22", title: "Coding Workshop" },
  ];

  const getEventByDate = (date: Date) => {
    return events.find((event) => {
      return new Date(event.date).toDateString() === date.toDateString();
    });
  };

  return (
    <div className="p-4 bg-zinc-900 rounded-xl w-fit shadow-lg">
      <Calendar
        locale="id-ID"
        value={value}
        onChange={(value) => {
          if (value instanceof Date) {
            setValue(value);
          }
        }}
        minDate={minDate}
        maxDate={maxDate}
        tileClassName={({ date }) => {
          const isEvent = getEventByDate(date);
          return isEvent
            ? "group relative after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:rounded-full after:bg-red-500"
            : "";
        }}
        tileContent={({ date }) => {
          const event = getEventByDate(date);
          return event ? (
            <>
              <div
                data-tooltip-id={`tooltip-${event.date}`}
                data-tooltip-content={event.title}
                className="absolute inset-0 z-10"
              />
              <Tooltip id={`tooltip-${event.date}`} />
            </>
          ) : null;
        }}
        className="text-white"
      />
    </div>
  );
}
