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
  { key: "tanggal", label: "Tanggal" },
];

type ProkerStatus = "Upcoming" | "Passed" | "Ongoing";

const StatusBadge = ({ status }: { status: "Upcoming" | "Passed" | "Ongoing" }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  if (status === "Upcoming") {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        Upcoming
      </span>
    );
  } else if (status === "Ongoing") {
    return (
      <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
        Ongoing
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Passed</span>
  );
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
    tanggal: string;
    [key: string]: unknown;
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proker ini?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/proker/delete?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Proker berhasil dihapus");
        window.location.reload();
      } else {
        alert("Gagal menghapus proker: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting proker:", error);
      alert("Terjadi kesalahan saat menghapus proker");
    }
  };

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
        const rawData = result.data as Proker[];
        const formattedData = rawData.map((item) => ({
          id: item.id,
          judul: item.judul,
          divisi: item.divisi,
          lokasi: item.lokasi,
          status: <StatusBadge status={item.status} />,
          tanggal: item.tanggal,
        }));
        setProkers(formattedData);
      } catch (error) {
        console.error("Error fetching proker data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);
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
          <button
            onClick={() => handleDelete(String(proker.id))}
            className="font-medium text-red-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}
    />
  );
};

export default DaftarProker;
