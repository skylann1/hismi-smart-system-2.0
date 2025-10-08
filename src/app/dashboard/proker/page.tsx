"use client";

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable"; // Pastikan path ini benar
import Link from "next/link";

// 1. Definisikan header, tambahkan kembali 'lokasi'
const tableHeaders: TableHeader[] = [
  { key: "title", label: "Nama Program Kerja" },
  { key: "divisi", label: "Divisi Penanggung Jawab" },
  { key: "lokasi", label: "Lokasi" },
  { key: "status", label: "Status" },
  { key: "tanggal_selesai", label: "Target Selesai" },
];

// Tipe data baru untuk status proker
type ProkerStatus = "Berjalan" | "Selesai" | "Direncanakan";

// 2. Modifikasi StatusBadge untuk status proker
const StatusBadge = ({ status }: { status: ProkerStatus }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  
  switch (status) {
    case "Berjalan":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Berjalan</span>;
    case "Selesai":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Selesai</span>;
    case "Direncanakan":
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Direncanakan</span>;
    default:
      return null;
  }
};

// 3. Siapkan data dummy, tambahkan kembali 'lokasi'
const prokerData: TableRow[] = [
  {
    id: "proker-01",
    title: "Kelas Belajar Bareng Web Development",
    divisi: "Pendidikan",
    lokasi: "Ruang Kelas A",
    status: <StatusBadge status="Berjalan" />,
    tanggal_selesai: "15 Desember 2025",
  },
  {
    id: "proker-02",
    title: "Pembuatan Website HIMSI",
    divisi: "Kominfo",
    lokasi: "Online",
    status: <StatusBadge status="Selesai" />,
    tanggal_selesai: "1 Juli 2025",
  },
  {
    id: "proker-03",
    title: "Makrab (Malam Keakraban)",
    divisi: "RSDM",
    lokasi: "Villa Puncak",
    status: <StatusBadge status="Direncanakan" />,
    tanggal_selesai: "20 Oktober 2025",
  },
  {
    id: "proker-04",
    title: "Seminar Teknologi AI",
    divisi: "Litbang",
    lokasi: "Aula Kampus",
    status: <StatusBadge status="Direncanakan" />,
    tanggal_selesai: "5 November 2025",
  },
];

const DaftarProker = () => {
  return (
    <ReusableTable
      title="Daftar Program Kerja"
      description="Semua program kerja HIMSI UBSI KLA dalam satu periode. Status akan diperbarui sesuai progres."
      headers={tableHeaders}
      data={prokerData}
      renderActions={(proker) => (
        <Link
          href={`proker/edit/${proker.id}`} // Arahkan ke halaman edit proker
          className="font-medium text-blue-600 hover:underline"
        >
          Edit
        </Link>
      )}
    />
  );
};

export default DaftarProker;