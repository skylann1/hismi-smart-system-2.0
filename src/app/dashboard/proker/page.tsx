"use client";

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import LoadingTableComponent from "@/components/ui/moleculs/LoadingTableComponent";
import { useState, useEffect } from "react";

const tableHeaders: TableHeader[] = [
  { key: "judul", label: "Nama Program Kerja" },
  { key: "divisi", label: "Divisi Penanggung Jawab" },
  { key: "lokasi", label: "Lokasi" },
  { key: "status", label: "Status" },
  { key: "tanggal_selesai", label: "Target Selesai" },
];

type ProkerStatus = "Berjalan" | "Selesai" | "Direncanakan";

const StatusBadge = ({ status }: { status: ProkerStatus }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";

  switch (status) {
    case "Berjalan":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Berjalan
        </span>
      );
    case "Selesai":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Selesai
        </span>
      );
    case "Direncanakan":
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Direncanakan
        </span>
      );
    default:
      return null;
  }
};

const DaftarProker = () => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/proker`;
  const [isLoading, setIsLoading] = useState(true);
  const [prokers, setProkers] = useState<TableRow[]>([]);

  type Proker = {
    id: string;
    judul: string;
    divisi: string;
    lokasi: string;
    status: ProkerStatus;
    tanggal_selesai: string;
    [key: string]: unknown;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch proker data");
        }
        const rawData = result.data as Proker [];
        const formattedData = rawData.map((item) => ({
          id: item.id,
          judul: item.judul,
          divisi: item.divisi,
          lokasi: item.lokasi,
          status: <StatusBadge status={item.status} />,
          tanggal_selesai: item.tanggal_selesai,
        }));
        setProkers(formattedData);
      } catch (error) {
        console.error("Error fetching proker data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return isLoading ? (
    <LoadingTableComponent />
  ) : (
    <ReusableTable
      title="Daftar Program Kerja"
      description="Semua program kerja HIMSI UBSI KLA dalam satu periode. Status akan diperbarui sesuai progres."
      headers={tableHeaders}
      data={prokers}
      renderActions={(proker) => (
        <div className="flex gap-2">
          <Link
            href={`proker/edit/${proker.id}`}
            className="font-medium text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <Link
            href={`proker/delete/${proker.id}`}
            className="font-medium text-red-600 hover:underline"
          >
            Hapus
          </Link>
        </div>
      )}
    />
  );
};

export default DaftarProker;
