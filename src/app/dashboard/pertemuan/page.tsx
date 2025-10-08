
import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable"; 
import Link from "next/link";

const tableHeaders: TableHeader[] = [
  { key: "title", label: "Judul Pertemuan" },
  { key: "lokasi", label: "Lokasi" },
  { key: "status", label: "Status" },
  { key: "tanggal", label: "Tanggal" },
];

const StatusBadge = ({ status }: { status: "Upcoming" | "Passed" }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  if (status === "Upcoming") {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        Upcoming
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
      Passed
    </span>
  );
};


const pertemuanData: TableRow[] = [
  {
    id: "meet-001",
    title: "Rapat Bulanan BPH & Koordinator",
    lokasi: "Sekretariat HIMSI",
    status: <StatusBadge status="Upcoming" />,
    tanggal: "30 Agustus 2025",
  },
  {
    id: "meet-002",
    title: "Evaluasi Program Kerja Divisi Pendidikan",
    lokasi: "Ruang Rapat Kampus",
    status: <StatusBadge status="Upcoming" />,
    tanggal: "5 September 2025",
  },
  {
    id: "meet-003",
    title: "Persiapan Acara Makrab",
    lokasi: "Online (Google Meet)",
    status: <StatusBadge status="Passed" />,
    tanggal: "15 Agustus 2025",
  },
  {
    id: "meet-004",
    title: "Kumpul Santai & Sharing Session",
    lokasi: "Taman Kota",
    status: <StatusBadge status="Passed" />,
    tanggal: "1 Agustus 2025",
  },
];

const DaftarPertemuan = () => {
  return (
    <ReusableTable
      title="Daftar Jadwal Pertemuan"
      description="Semua jadwal pertemuan dan acara HIMSI UBSI KLA. Jadwal yang sudah lewat akan ditandai sebagai 'Passed'."
      headers={tableHeaders}
      data={pertemuanData}
      renderActions={(pertemuan) => (
        <Link
          href={`pertemuan/edit/${pertemuan.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          Edit
        </Link>
      )}
    />
  );
};

export default DaftarPertemuan;