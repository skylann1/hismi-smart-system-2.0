"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import EventCard from "@/components/ui/organisms/EventCard";
import { useState } from "react";
import { EventCardComponent } from "@/components/ui/organisms/EventCard";

const filters = ["Semua", "Acara", "Kegiatan", "Pertemuan"];
const contents: EventCardComponent[] = [
  {
    month: "Oktober",
    date: "15",
    title: "Rapat Koordinasi",
    description: "Rapat koordinasi untuk membahas agenda mendatang.",
    time: "10:00 - 12:00",
    location: "Ruang Rapat Utama",
    organizer: "HIMSI",
    methodEvent: "Offline",
    type: "Pertemuan",
  },
  {
    month: "Oktober",
    date: "15",
    title: "Rapat Koordinasi",
    description: "Rapat koordinasi untuk membahas agenda mendatang Musyarah bewar dan oprec rendanca bulann afoijweofcjef jbqad.",
    time: "10:00 - 12:00",
    location: "Ruang Rapat Utama",
    organizer: "HIMSI",
    methodEvent: "Online",
    type: "Kegiatan",
  },
  {
    month: "Oktober",
    date: "15",
    title: "Rapat Koordinasi",
    description: "Rapat koordinasi untuk membahas agenda mendatang Musyarah bewar dan oprec rendanca bulann afoijweofcjef jbqad.",
    time: "10:00 - 12:00",
    location: "Ruang Rapat Utama",
    organizer: "HIMSI",
    methodEvent: "Online",
    type: "Acara",
  },
  {
    month: "Oktober",
    date: "15",
    title: "Rapat Koordinasi",
    description: "Rapat koordinasi untuk membahas agenda mendatang Musyarah bewar dan oprec rendanca bulann afoijweofcjef jbqad.",
    time: "10:00 - 12:00",
    location: "Ruang Rapat Utama",
    organizer: "HIMSI",
    methodEvent: "Online",
    type: "Pertemuan",
  },
  {
    month: "Oktober",
    date: "15",
    title: "Rapat Koordinasi",
    description: "Rapat koordinasi untuk membahas agenda mendatang Musyarah bewar dan oprec rendanca bulann afoijweofcjef jbqad.",
    time: "10:00 - 12:00",
    location: "Ruang Rapat Utama",
    organizer: "HIMSI",
    methodEvent: "Online",
    type: "Pertemuan",
  },
  {
    month: "Oktober",
    date: "15",
    title: "Rapat Koordinasi",
    description: "Rapat koordinasi untuk membahas agenda mendatang Musyarah bewar dan oprec rendanca bulann afoijweofcjef jbqad.",
    time: "10:00 - 12:00",
    location: "Ruang Rapat Utama",
    organizer: "HIMSI",
    methodEvent: "Online",
    type: "Pertemuan",
  },
];

export default function Page() {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  console.log("Selected Filter:", selectedFilter);

  const FilteredContent = contents.filter((event) => {
    if (selectedFilter === "Semua") return true;

    return event.type === selectedFilter;
  })
  return (
    <DashboardSection className="flex flex-col gap-10 bg-white w-full min-h-screen p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Jadwal Mendatang</h1>
        <span className="text-sm font-normal text-gray-500 max-w-3xl">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam exercitationem, ipsum voluptatum sapiente corporis voluptate quod dolor minus, corrupti ducimus nobis, quisquam iste eos. Repudiandae commodi tenetur similique nostrum iste.</span>
        <div className="inline-flex items-center space-x-1 rounded-lg p-1 bg-gray-100 w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2 py-1 md:px-4 md:py-1.5 text-sm md:text-sm font-semibold rounded-md transition-all duration-200 bg-gray-100 cursor-pointer text-gray-600
            ${
              selectedFilter === filter
                ? "bg-gray-700 text-white shadow-sm"
                : ""
            }
          `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.values(FilteredContent).map((event, i) =>
          i % 2 === 0 ? (
            <EventCard
              key={i}
              className="bg-indigo-800/80 text-white"
              content={event}
            />
          ) : (
            <EventCard
              key={i}
              className="bg-gray-100 text-gray-800"
              content={event}
            />
          )
        )}
      </div>
    </DashboardSection>
  );
}
