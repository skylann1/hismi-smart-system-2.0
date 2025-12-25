"use client";

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import LoadingTableComponent from "@/components/ui/moleculs/LoadingTableComponent";
import { useState, useEffect } from "react";

const tableHeaders: TableHeader[] = [
  { key: "judul", label: "Nama Kegiatan" },
  { key: "divisi", label: "Divisi Penyelenggara" },
  { key: "lokasi", label: "Lokasi" },
  { key: "status", label: "Status" },
  { key: "tanggal", label: "Tanggal Pelaksanaan" },
];

// Tipe data baru untuk status kegiatan
type KegiatanStatus = "Upcoming" | "Passed" | "Ongoing";

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


const DaftarKegiatan = () => {
  const url = `/dashboard/api/kegiatan`;
  const [isLoading, setIsLoading] = useState(true);
  const [kegiatans, setKegiatans] = useState<TableRow[]>([]);

  type Kegiatan = {
    id: string;
    judul: string;
    divisi: string;
    lokasi: string;
    status: KegiatanStatus;
    tanggal: string;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      return;
    }

    try {
      const response = await fetch(`/dashboard/api/kegiatan/delete?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Kegiatan berhasil dihapus");
        // Refresh data
        window.location.reload();
      } else {
        alert("Gagal menghapus kegiatan: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting kegiatan:", error);
      alert("Terjadi kesalahan saat menghapus kegiatan");
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
          throw new Error(result.message || "Failed to fetch kegiatan data");
        }
        const rawData = result.data as Kegiatan[];
        const formattedData = rawData.map((item) => ({
          id: item.id,
          judul: String(item.judul || ""),
          divisi: String(item.divisi || ""),
          lokasi: String(item.lokasi || ""),
          status: <StatusBadge status={item.status} />,
          tanggal: String(item.tanggal || ""),
        }));
        setKegiatans(formattedData);
      } catch (error) {
        console.error("Error fetching kegiatan data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return (
    <>
      {isLoading ? (
        <LoadingTableComponent />
      ) : (
        <ReusableTable
          title="Daftar Kegiatan HIMSI"
          description="Semua kegiatan yang telah dan akan diselenggarakan oleh HIMSI UBSI KLA dalam satu periode."
          headers={tableHeaders}
          data={kegiatans}
          renderActions={(kegiatan) => (
            <div className="flex gap-2">
              <Link
                href={`kegiatan/edit/${kegiatan.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(String(kegiatan.id))}
                className="font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        />
      )}
    </>
  );
};

export default DaftarKegiatan;
