"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import EventCard from "@/components/ui/organisms/EventCard";
import { useEffect, useState } from "react";
import { EventCardComponent } from "@/components/ui/organisms/EventCard";
import { getUpcomingEvents } from "@/lib/firebase/services";

const filters = ["Semua", "Acara", "Kegiatan", "Pertemuan"];

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return {
    month: months[date.getMonth()],
    date: date.getDate().toString()
  };
};

export default function Page() {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [events, setEvents] = useState<EventCardComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getUpcomingEvents();
        if (res.success && res.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedEvents = res.data.map((item: any) => {
            // Safely handle strings to avoid "Objects are not valid as a React child"
            const safeString = (val: unknown) =>
              (typeof val === "string" ? val : (typeof val === "number" ? String(val) : ""));

            // Safely handle date
            let dateStr = item.tanggal;
            if (typeof dateStr !== 'string') {
              dateStr = new Date().toISOString();
            }
            const { month, date } = formatDate(dateStr);

            // Determine type for filter compatibility
            let type = item.type; // "Pertemuan", "Kegiatan", "Proker"
            if (type === "Proker") type = "Acara";

            return {
              month: safeString(month) || "-",
              date: safeString(date) || "-",
              title: safeString(item.judul) || safeString(item.nama) || "No Title",
              description: safeString(item.deskripsi) || "No Description",
              time: (item.jamMulai && item.jamSelesai) ? `${safeString(item.jamMulai)} - ${safeString(item.jamSelesai)}` : "TBA",
              location: safeString(item.lokasi) || "Location TBA",
              organizer: safeString(item.divisi) || "HIMSI",
              methodEvent: safeString(item.metode) || "Offline",
              type: safeString(type),
              id: safeString(item.id),
              mapsLink: safeString(item.maps) || undefined,
            };
          });
          setEvents(mappedEvents);
        }
      } catch (err) {
        console.error("Failed to map events:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const FilteredContent = events.filter((event) => {
    if (selectedFilter === "Semua") return true;
    return event.type === selectedFilter;
  });

  return (
    <DashboardSection className="flex flex-col gap-10 bg-white w-full min-h-screen p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Jadwal Mendatang</h1>
        <span className="text-sm font-normal text-gray-500 max-w-3xl">
          Berikut adalah jadwal kegiatan, acara, dan pertemuan mendatang HIMSI.
        </span>
        <div className="inline-flex items-center space-x-1 rounded-lg p-1 bg-gray-100 w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2 py-1 md:px-4 md:py-1.5 text-sm md:text-sm font-semibold rounded-md transition-all duration-200 bg-gray-100 cursor-pointer text-gray-600
            ${selectedFilter === filter
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

      {loading ? (
        <div className="flex w-full justify-center py-10">Searching data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FilteredContent.length > 0 ? (
            FilteredContent.map((event, i) => (
              <EventCard
                key={i}
                className={i % 2 === 0 ? "bg-indigo-800/80 text-white" : "bg-gray-100 text-gray-800"}
                content={event}
              />
            ))
          ) : (
            <div className="text-gray-500 col-span-3 text-center py-10">Tidak ada jadwal mendatang.</div>
          )}
        </div>
      )}
    </DashboardSection>
  );
}
