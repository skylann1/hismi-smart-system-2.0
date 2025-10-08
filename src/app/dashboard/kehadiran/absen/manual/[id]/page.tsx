"use client";

import React, { useState, Fragment } from "react"; // Tambahkan Fragment
import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable"; // Pastikan path ini benar
import { useParams } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react"; // Import dari Headless UI
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"; // Import ikon

// Tipe data untuk status kehadiran
type AttendanceStatus = "hadir" | "sakit" | "izin" | "absen";

// Interface untuk setiap anggota
interface MemberAttendance {
  id: string;
  nama: string;
  divisi: string;
  jabatan: string;
  imageUrl: string;
  hadir: AttendanceStatus;
}

// --- Data Dummy ---
const dummyEventTitle = "Rapat Bulanan BPH & Koordinator";
const dummyAnggotaList: MemberAttendance[] = [
    { id: "agt-001", nama: "Ahmad Subarjo", divisi: "Pendidikan", jabatan: "Koordinator", imageUrl: "...", hadir: "sakit" },
    { id: "agt-002", nama: "Budi Santoso", divisi: "Kominfo", jabatan: "Anggota", imageUrl: "...", hadir: "hadir" },
    { id: "agt-003", nama: "Citra Lestari", divisi: "RSDM", jabatan: "Anggota", imageUrl: "...", hadir: "absen" },
    { id: "agt-004", nama: "Dewi Anggraini", divisi: "Litbang", jabatan: "Koordinator", imageUrl: "...", hadir: "izin" },
    { id: "agt-005", nama: "Eko Prasetyo", divisi: "BPH", jabatan: "Ketua", imageUrl: "...", hadir: "hadir" },
];

// Konfigurasi untuk label dan warna setiap status
const statusConfig: Record<AttendanceStatus, { label: string; colorClass: string }> = {
  hadir: { label: "Hadir", colorClass: "bg-green-500" },
  sakit: { label: "Sakit", colorClass: "bg-yellow-500" },
  izin: { label: "Izin", colorClass: "bg-blue-500" },
  absen: { label: "Absen", colorClass: "bg-red-500" },
};

// --- Komponen Dropdown BARU yang Keren ---
const StatusSelector = ({
  currentStatus,
  onChange,
}: {
  currentStatus: AttendanceStatus;
  onChange: (newStatus: AttendanceStatus) => void;
}) => {
  return (
    <Listbox value={currentStatus} onChange={onChange}>
      <div className="relative w-32">
        {/* Tombol yang menampilkan status terpilih */}
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
          <span className="flex items-center">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${statusConfig[currentStatus].colorClass}`}
            />
            <span className="ml-2 block truncate">{statusConfig[currentStatus].label}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        {/* Opsi dropdown dengan animasi */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {Object.keys(statusConfig).map((statusKey) => (
              <Listbox.Option
                key={statusKey}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                  }`
                }
                value={statusKey}
              >
                {({ selected }) => (
                  <>
                    <span className="flex items-center">
                       <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${statusConfig[statusKey as AttendanceStatus].colorClass}`}
                      />
                      <span className={`ml-2 block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {statusConfig[statusKey as AttendanceStatus].label}
                      </span>
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};


// --- Halaman Utama (Tidak ada perubahan di sini) ---
export default function AbsenManualPage() {
  const params = useParams();
  const eventId = params.id;
  const [attendanceList, setAttendanceList] = useState<MemberAttendance[]>(dummyAnggotaList);

  const handleStatusChange = (memberId: string, newStatus: AttendanceStatus) => {
    setAttendanceList(
      attendanceList.map((member) =>
        member.id === memberId ? { ...member, hadir: newStatus } : member
      )
    );
  };

  const tableHeaders: TableHeader[] = [
    { key: "nama", label: "Nama Anggota" },
    { key: "divisi", label: "Divisi" },
    { key: "jabatan", label: "Jabatan" },
    { key: "status", label: "Status Kehadiran" },
  ];

  const processedData: TableRow[] = attendanceList.map((member) => ({
    id: member.id,
    nama: (
      <div className="flex items-center">
        <span className="ml-3 font-medium text-gray-800">{member.nama}</span>
      </div>
    ),
    divisi: member.divisi,
    jabatan: member.jabatan,
    status: (
      <StatusSelector
        currentStatus={member.hadir}
        onChange={(newStatus) => handleStatusChange(member.id, newStatus)}
      />
    ),
  }));

  const totalHadir = attendanceList.filter((m) => m.hadir === "hadir").length;
  const totalIzin = attendanceList.filter((m) => m.hadir === "izin").length;
  const totalSakit = attendanceList.filter((m) => m.hadir === "sakit").length;
  const totalAbsen = attendanceList.filter((m) => m.hadir === "absen").length;

  return (
    <div className="min-h-screen">
      <ReusableTable
        title={`Absensi Manual: ${dummyEventTitle}`}
        description={`Hadir: ${totalHadir} | Izin: ${totalIzin} | Sakit: ${totalSakit} | Absen: ${totalAbsen}`}
        headers={tableHeaders}
        data={processedData}
      />
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Simpan Absensi
        </button>
      </div>
    </div>
  );
}