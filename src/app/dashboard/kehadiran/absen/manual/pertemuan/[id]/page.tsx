"use client";

import React, { useState, useEffect } from "react";
import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import { exportToExcel, formatStatusForExcel } from "@/lib/excelExport";
import { HiDownload } from "react-icons/hi";

type AttendanceStatus = "hadir" | "sakit" | "izin" | "absen";

const statusConfig: Record<
  AttendanceStatus,
  { label: string; colorClass: string }
> = {
  hadir: { label: "Hadir", colorClass: "bg-green-500" },
  sakit: { label: "Sakit", colorClass: "bg-yellow-500" },
  izin: { label: "Izin", colorClass: "bg-blue-500" },
  absen: { label: "Absen", colorClass: "bg-red-500" },
};

const StatusSelector = ({
  value,
  onChange,
}: {
  value: AttendanceStatus;
  onChange: (newStatus: AttendanceStatus) => void;
}) => {
  const allStatuses: AttendanceStatus[] = ["hadir", "izin", "sakit", "absen"];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AttendanceStatus)}
      className={`rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusConfig[value]?.colorClass ?? "bg-gray-100"
        } text-white`}
    >
      {allStatuses.map((statusKey) => (
        <option key={statusKey} value={statusKey}>
          {statusConfig[statusKey].label}
        </option>
      ))}
    </select>
  );
};

type MemberType = {
  id: string;
  nama: string;
  divisi: string;
  role: string;
  imageUrl?: string;
  nim?: string;
  email?: string;
  no_hp?: string;
  status: AttendanceStatus;
};

type AcaraAttendance = {
  id: string;
  judul: string;
  lokasi: string;
  jamSelesai: string;
  jamMulai: string;
  status: string;
  tanggal: string;
  type: string;
  maps: string;
  divisi: string;
  deskripsi: string;
  absen: MemberType[];
};

export default function AbsenManualPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const eventId = params.id as string;
  const [data, setData] = useState<AcaraAttendance | null>(null);
  const [attendanceList, setAttendanceList] = useState<MemberType[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/dashboard/api/kehadiran?id=${eventId}&tipe=pertemuan`,
          {
            cache: "no-cache",
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data acara");
        const result = await res.json();

        if (result?.data?.absen) {
          setData(result.data);

          const validatedAbsen = result.data.absen.map((member: MemberType) => {
            const validStatuses: AttendanceStatus[] = [
              "hadir",
              "izin",
              "sakit",
              "absen",
            ];
            const rawStatus =
              typeof member.status === "string"
                ? member.status.toLowerCase()
                : undefined;
            const fixedStatus: AttendanceStatus =
              rawStatus && validStatuses.includes(rawStatus as AttendanceStatus)
                ? (rawStatus as AttendanceStatus)
                : "absen";

            return { ...member, status: fixedStatus };
          });

          setAttendanceList(validatedAbsen);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (eventId) fetchData();
  }, [eventId]);

  const handleStatusChange = (
    memberId: string,
    newStatus: AttendanceStatus
  ) => {
    setAttendanceList((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: newStatus } : member
      )
    );
  };

  const tableHeaders: TableHeader[] = [
    { key: "nama", label: "Nama Anggota" },
    { key: "divisi", label: "Divisi" },
    { key: "role", label: "Jabatan" },
    { key: "status", label: "Status Kehadiran" },
  ];

  const filteredList = attendanceList.filter((member) =>
    member.nama.toLowerCase().includes(search.toLowerCase())
  );

  const processedData: TableRow[] = filteredList.map((member) => ({
    id: `${member.id}-${member.status}`,
    nama: (
      <div className="flex items-center">
        <span className="ml-3 font-medium text-gray-800">{member.nama}</span>
      </div>
    ),
    divisi: member.divisi,
    role: member.role,
    status: (
      <StatusSelector
        value={member.status}
        onChange={(newStatus) => handleStatusChange(member.id, newStatus)}
      />
    ),
  }));

  const totalHadir = attendanceList.filter((m) => m.status === "hadir").length;
  const totalIzin = attendanceList.filter((m) => m.status === "izin").length;
  const totalSakit = attendanceList.filter((m) => m.status === "sakit").length;
  const totalAbsen = attendanceList.filter((m) => m.status === "absen").length;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/dashboard/api/kehadiran/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: eventId,
          absen: attendanceList.map((m) => ({
            id: m.id,
            status: m.status,
          })),
          tipe: "pertemuan",
        }),
      });

      const result = await res.json();
      if (result.status === false) {
        dispatch(
          alertIsAktif({
            status: false,
            title: "Error! Gagal menyimpan perubahan data ke sistem.",
            message: result.message,
          })
        );
      }
      dispatch(
        alertIsAktif({
          status: true,
          title: "Success! Berhasil menyimpan perubahan data ke sistem.",
          message: result.message,
        })
      );
      router.push("/dashboard/kehadiran/absen");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Gagal menyimpan absensi ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!data || attendanceList.length === 0) {
      alert("Tidak ada data untuk diunduh");
      return;
    }

    // Prepare Excel data
    const excelData = attendanceList.map((member, index) => ({
      no: index + 1,
      nim: member.nim || "-",
      nama: member.nama,
      divisi: member.divisi,
      role: member.role,
      email: member.email || "-",
      no_hp: member.no_hp || "-",
      status: formatStatusForExcel(member.status),
    }));

    // Export to Excel
    exportToExcel({
      filename: `Absensi_${data.judul}_${data.tanggal}`.replace(/[/\\?%*:|"<>]/g, '-'),
      sheetName: 'Daftar Hadir',
      columns: [
        { header: 'No', key: 'no', width: 5 },
        { header: 'NIM', key: 'nim', width: 12 },
        { header: 'Nama', key: 'nama', width: 25 },
        { header: 'Divisi', key: 'divisi', width: 20 },
        { header: 'Jabatan', key: 'role', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'No. HP', key: 'no_hp', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
      ],
      data: excelData,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 flex justify-between bg-white items-center py-4 px-2 rounded-lg">
        <span className="text-base font-semibold text-gray-900">Filter by  name</span>

        <input
          type="text"
          placeholder="Cari nama anggota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <ReusableTable
        title={`Absensi Manual: ${data?.judul || "Loading..."}`}
        description={`Hadir: ${totalHadir} | Izin: ${totalIzin} | Sakit: ${totalSakit} | Absen: ${totalAbsen}`}
        headers={tableHeaders}
        data={processedData}
      />

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleDownloadExcel}
          disabled={!data || attendanceList.length === 0}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiDownload className="text-lg" />
          Download Excel
        </button>
        <button
          disabled={isLoading}
          type="button"
          onClick={handleSave}
          className={`rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 ${isLoading && "opacity-50 cursor-not-allowed"
            }`}
        >
          {isLoading ? "Loading..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}