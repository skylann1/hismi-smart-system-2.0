import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import { use } from "react";
// import Link from "next/link";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const tableHeaders: TableHeader[] = [
  { key: "nama", label: "Nama" },
  { key: "divisi", label: "Divisi" },
  { key: "jabatan", label: "Jabatan" },
  { key: "status", label: "Status" },
];

const anggotaData: TableRow[] = [
  {
    id: 1,
    nama: "John Doe",
    divisi: "Pendidikan",
    jabatan: "Koordinator",
    status: "Belum bayar",
  },
];

export default function DetailKasBulan({ params }: PageProps) {
  const { slug } = use(params);
  console.log(slug);
  return (
    <ReusableTable
      title={`Daftar tagihan kas bulan ${slug}`}
      description="Daftar kas bulan HIMSI UBSI KLA satu periode, data ini akan direset ketika masa periode tersebut habis."
      headers={tableHeaders}
      data={anggotaData}
    />
  );
}
