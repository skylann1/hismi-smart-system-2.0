// app/page.tsx atau halaman lainnya

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";

// Definisikan header tabel sesuai dengan tipe TableHeader
const tableHeaders: TableHeader[] = [
  { key: "nama", label: "Nama" },
  { key: "divisi", label: "Divisi" },
  { key: "jabatan", label: "Jabatan" },
  { key: "telepon", label: "No Telepon" },
  { key: "tagihan", label: "Tagihan" },
];

const anggotaData: TableRow[] = [
  {
    id: 1,
    nama: "Ahmad Subarjo",
    divisi: "Pendidikan",
    jabatan: "Koordinator",
    telepon: "081234567890",
    tagihan: 50000
  },
  {
    id: 2,
    nama: "Ahmad Subarjo",
    divisi: "Pendidikan",
    jabatan: "Koordinator",
    telepon: "081234567890",
    tagihan: 50000
  },
  {
    id: 3,
    nama: "Ahmad Subarjo",
    divisi: "Pendidikan",
    jabatan: "Koordinator",
    telepon: "081234567890",
    tagihan: 50000
  },
];

const KasAnggota = () => {
  return (
    <ReusableTable
      title="Daftar kas anggota"
      description="Daftar kas anggota HIMSI UBSI KLA satu periode, data ini akan direset ketika masa periode tersebut habis."
      headers={tableHeaders}
      data={anggotaData}
      renderActions={(anggota) => (
        <Link
          href={`anggota/detail/${anggota.id}`} 
          className="font-medium text-blue-600 hover:underline "
        >
          Edit
        </Link>
      )}
    />
  );
};

export default KasAnggota;
