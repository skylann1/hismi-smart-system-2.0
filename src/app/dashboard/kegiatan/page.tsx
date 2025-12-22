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
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/kegiatan`;
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
          judul: item.judul,
          divisi: item.divisi,
          lokasi: item.lokasi,
          status: <StatusBadge status={item.status} />,
          tanggal: item.tanggal,
        }));
        setKegiatans(formattedData);
      } catch (error) {
        console.error("Error fetching kegiatan data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
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
            <Link
              href={`kegiatan/edit/${kegiatan.id}`} // Arahkan ke halaman edit kegiatan
              className="font-medium text-blue-600 hover:underline"
            >
              Edit
            </Link>
          )}
        />
      )}
    </>
  );
};

export default DaftarKegiatan;
