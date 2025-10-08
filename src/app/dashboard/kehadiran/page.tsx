// app/absensi/page.tsx atau halaman lainnya

import ReusableTable, {
  type TableHeader,
} from "@/components/ui/moleculs/table/PrimaryTable"; // Pastikan path ini benar
import Link from "next/link";

const tableHeaders: TableHeader[] = [
  { key: "nama", label: "Nama Anggota" },
  { key: "divisi", label: "Divisi" },
  { key: "jabatan", label: "Jabatan" },
  { key: "hadir", label: "Hadir" },
  { key: "tidakHadir", label: "Tidak Hadir" },
  { key: "status", label: "Status" },
];

// Tipe data untuk status absensi
type AbsensiStatus = "Aman" | "Warning" | "Dropout";

const StatusBadge = ({ status }: { status: AbsensiStatus }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  
  switch (status) {
    case "Warning":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Warning</span>;
    case "Dropout":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Dropout</span>;
    case "Aman":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Aman</span>;
    default:
      return null;
  }
};

const absensiRawData = [
  {
    id: "abs-001",
    nama: "Ahmad Subarjo",
    divisi: "Pendidikan",
    jabatan: "Koordinator",
    hadir: 8,
    tidakHadir: 4, 
  },
  {
    id: "abs-002",
    nama: "Budi Santoso",
    divisi: "Kominfo",
    jabatan: "Anggota",
    hadir: 10,
    tidakHadir: 2, 
  },
  {
    id: "abs-003",
    nama: "Citra Lestari",
    divisi: "RSDM",
    jabatan: "Anggota",
    hadir: 7,
    tidakHadir: 5,
  },
  {
    id: "abs-004",
    nama: "Dewi Anggraini",
    divisi: "Litbang",
    jabatan: "Koordinator",
    hadir: 9,
    tidakHadir: 3, 
  },
   {
    id: "abs-005",
    nama: "Eko Prasetyo",
    divisi: "BPH",
    jabatan: "Ketua",
    hadir: 12,
    tidakHadir: 0, // Status "Aman"
  },
];

const DaftarAbsensi = () => {
  const processedData = absensiRawData.map(anggota => {
    let status: AbsensiStatus = "Aman";
    if (anggota.tidakHadir >= 5) {
      status = "Dropout";
    } else if (anggota.tidakHadir >= 3) {
      status = "Warning";
    }

    return {
      ...anggota,
      status: <StatusBadge status={status} />,
    };
  });

  return (
    <ReusableTable
      title="Daftar Absensi Anggota"
      description="Rekapitulasi jumlah kehadiran seluruh anggota HIMSI UBSI KLA dalam satu periode."
      headers={tableHeaders}
      data={processedData} // Gunakan data yang sudah diproses
      renderActions={(anggota) => (
        <Link
          href={`kehadiran/detail/${anggota.id}`} // Arahkan ke halaman detail absensi
          className="font-medium text-blue-600 hover:underline"
        >
          Lihat Detail
        </Link>
      )}
    />
  );
};

export default DaftarAbsensi;
