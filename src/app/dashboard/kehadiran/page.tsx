/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReusableTable, {
  type TableHeader,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingTableComponent from "@/components/ui/moleculs/LoadingTableComponent";

const tableHeaders: TableHeader[] = [
  { key: "nama", label: "Nama Anggota" },
  { key: "divisi", label: "Divisi" },
  { key: "jabatan", label: "Jabatan" },
  { key: "hadir", label: "Hadir" },
  { key: "tidakHadir", label: "Tidak Hadir" },
  { key: "status", label: "Status" },
];

type AbsensiStatus = "Aman" | "Warning" | "Dropout";

const StatusBadge = ({ status }: { status: AbsensiStatus }) => {
  const base = "px-3 py-1 text-xs font-medium rounded-full";

  if (status === "Warning")
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>Warning</span>;

  if (status === "Dropout")
    return <span className={`${base} bg-red-100 text-red-800`}>Dropout</span>;

  return <span className={`${base} bg-green-100 text-green-800`}>Aman</span>;
};

// izin & sakit dihitung hadir
const isHadir = (status: string) =>
  ["hadir", "izin", "sakit"].includes(status?.toLowerCase());

const DaftarAbsensi = () => {
  const [absensiData, setAbsensiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/kehadiran/summary`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setAbsensiData(json.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 GROUPING PER ANGGOTA
  const grouped = absensiData.reduce((acc: any, item: any) => {
    const id = item.id; // atau anggotaId

    if (!acc[id]) {
      acc[id] = {
        id,
        nama: item.nama,
        divisi: item.divisi,
        jabatan: item.jabatan,
        hadir: 0,
        tidakHadir: 0,
      };
    }

    if (isHadir(item.status)) acc[id].hadir += 1;
    else acc[id].tidakHadir += 1;

    return acc;
  }, {});

  const processedData = Object.values(grouped).map((a: any) => {
    let status: AbsensiStatus = "Aman";
    if (a.tidakHadir >= 5) status = "Dropout";
    else if (a.tidakHadir >= 3) status = "Warning";

    return {
      ...a,
      status: <StatusBadge status={status} />,
    };
  });

  if (loading) return <LoadingTableComponent/>;

  return (
    <ReusableTable
      title="Daftar Absensi Anggota"
      description="Rekap kehadiran anggota"
      headers={tableHeaders}
      data={processedData}
      renderActions={(anggota) => (
        <Link
          href={`kehadiran/detail/${anggota.id}`}
          className="text-blue-600 hover:underline"
        >
          Lihat Detail
        </Link>
      )}
    />
  );
};

export default DaftarAbsensi;
