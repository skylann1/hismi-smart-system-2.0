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
      className={`rounded-lg border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        statusConfig[value]?.colorClass ?? "bg-gray-100"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/dashboard/api/kehadiran?id=${eventId}&tipe=kegiatan`,
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

  const processedData: TableRow[] = attendanceList.map((member) => ({
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
          tipe: "kegiatan",
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

  return (
    <div className="min-h-screen">
      <ReusableTable
        title={`Absensi Manual: ${data?.judul || "Loading..."}`}
        description={`Hadir: ${totalHadir} | Izin: ${totalIzin} | Sakit: ${totalSakit} | Absen: ${totalAbsen}`}
        headers={tableHeaders}
        data={processedData}
      />

      <div className="mt-6 flex justify-end">
        <button
          disabled={isLoading}
          type="button"
          onClick={handleSave}
          className={`rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 ${
            isLoading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Loading..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
