"use client";

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoadingTableComponent from "@/components/ui/moleculs/LoadingTableComponent";

const ManualIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
    <path d="M18 2 22 6" />
    <path d="m15 5 3 3" />
  </svg>
);
const QRIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const tableHeaders: TableHeader[] = [
  { key: "judul", label: "Judul Acara" },
  { key: "type", label: "Tipe" },
  { key: "lokasi", label: "Lokasi" },
  { key: "tanggal", label: "Waktu" },
  { key: "status", label: "Status" },
];

type AcaraType = "pertemuan" | "kegiatan" | "proker";
type AcaraStatus = "Upcoming" | "Passed" | "Ongoing";

const TypeBadge = ({ type }: { type: AcaraType }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";

  switch (type) {
    case "pertemuan":
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
          Pertemuan
        </span>
      );
    case "kegiatan":
      return (
        <span className={`${baseClasses} bg-sky-100 text-sky-800`}>
          Kegiatan
        </span>
      );
    case "proker":
      return (
        <span className={`${baseClasses} bg-amber-100 text-amber-800`}>
          Proker
        </span>
      );
    default:
      return null;
  }
};

const StatusBadge = ({
  status,
}: {
  status: "Upcoming" | "Passed" | "Ongoing";
}) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  if (status === "Upcoming") {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        Upcoming
      </span>
    );
  } else if (status === "Ongoing") {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        Ongoing
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Passed</span>
  );
};

const KelolaAbsensiPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TableRow[]>([]);

  type Acara = {
    id: string;
    judul: string;
    type: AcaraType;
    lokasi: string;
    tanggal: string;
    jamSelesai?: string;
    jamMulai?: string;
    status: AcaraStatus;
    [key: string]: unknown;
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `/dashboard/api/acara`;
      if (!url) {
        console.error("NEXT_PUBLIC_BASE_URL is not defined");
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(url, { cache: "no-store" });
        const result = await response.json();

        const rawData = result.data as Acara[];

        if (!response.ok) throw new Error("Failed to fetch data");

        const mappedData: TableRow[] = rawData.map((item: Acara) => ({
          id: item.id,
          judul: item.judul,
          lokasi: item.lokasi ?? "",
          status: <StatusBadge status={item.status} />,
          tanggal: item.tanggal,
          jamMulai: item.jamMulai ?? "",
          jamSlesai: item.jamSelesai ?? "",
          type: <TypeBadge type={item.type} />,
          typeLabel: item.type,
          statusLabel: item.status,
        }));

        setData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log();
  return (
    <>
      {isLoading ? (
        <LoadingTableComponent />
      ) : (
        <ReusableTable
          title="Kelola Absensi Acara"
          description="Pilih acara untuk melakukan absensi anggota secara manual atau menggunakan QR code."
          headers={tableHeaders}
          data={data}
          renderActions={(acara) => (
            <div className="flex items-center gap-4">
              <Link
                href={`absen/manual/${acara.typeLabel}/${acara.id}`}
                className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                <ManualIcon />
                Manual
              </Link>
              <Link
                href={`absen/scanning/tutorial/${acara.id}/${acara.typeLabel}/${acara.statusLabel}`}
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <QRIcon />
                QR
              </Link>
            </div>
          )}
        />
      )}
    </>
  );
};

export default KelolaAbsensiPage;
