// app/page.tsx atau halaman lainnya

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import { IoEyeSharp } from "react-icons/io5";
import Link from "next/link";

// Definisikan header tabel sesuai dengan tipe TableHeader
const tableHeaders: TableHeader[] = [
  { key: "bulan", label: "Bulan" },
  { key: "lunas", label: "Lunas" },
  { key: "belum_lunas", label: "Belum Lunas" },
  { key: "nominal", label: "Nominal" },
];

const anggotaData: TableRow[] = [
  {
    id: 1,
    bulan: "Januari",
    lunas: 39,
    belum_lunas: 10,
    nominal: 39000
  },
  {
    id: 2,
    bulan: "Febuari",
    lunas: 29,
    belum_lunas: 19,
    nominal: 29000
  },
  {
    id: 3,
    bulan: "Januari",
    lunas: 10,
    belum_lunas: 40,
    nominal: 10000
  },
];

const KasBulan = () => {
  return (
    <ReusableTable
      title="Daftar kas bulan"
      description="Daftar kas bulan HIMSI UBSI KLA satu periode, data ini akan direset ketika masa periode tersebut habis."
      headers={tableHeaders}
      data={anggotaData}
      renderActions={(anggota) => (
        <Link
          href={`/dashboard/keuangan/kas/bulan/${anggota.id}`} 
          className="font-medium text-blue-600 hover:underline opacity-50 group group-hover:opacity-100"
        >
          <IoEyeSharp className=""/>
        </Link>
      )}
    />
  );
};

export default KasBulan;
