import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable"; 
import Link from "next/link";

const tableHeaders: TableHeader[] = [
  { key: "title", label: "Nama Kegiatan" },
  { key: "divisi", label: "Divisi Penyelenggara" },
  { key: "lokasi", label: "Lokasi" },
  { key: "status", label: "Status" },
  { key: "tanggal", label: "Tanggal Pelaksanaan" },
];

// Tipe data baru untuk status kegiatan
type KegiatanStatus = "Upcoming" | "Passed";

const StatusBadge = ({ status }: { status: KegiatanStatus }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  
  switch (status) {
    case "Upcoming":
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Upcoming</span>;
    case "Passed":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Passed</span>;
    default:
      return null;
  }
};

const kegiatanData: TableRow[] = [
  {
    id: "keg-01",
    title: "Workshop Desain Grafis dengan Canva",
    divisi: "Kominfo",
    lokasi: "Laboratorium Komputer",
    status: <StatusBadge status="Upcoming" />,
    tanggal: "15 September 2025",
  },
  {
    id: "keg-02",
    title: "Pengabdian Masyarakat: Pelatihan Office",
    divisi: "Pendidikan",
    lokasi: "SMK Harapan Bangsa",
    status: <StatusBadge status="Passed" />,
    tanggal: "20 Juli 2025",
  },
  {
    id: "keg-03",
    title: "Turnamen E-Sports Internal",
    divisi: "RSDM",
    lokasi: "Online",
    status: <StatusBadge status="Upcoming" />,
    tanggal: "5 Agustus 2025",
  },
  {
    id: "keg-04",
    title: "Diskusi Panel: Karir di Bidang IT",
    divisi: "Litbang",
    lokasi: "Aula Kampus",
    status: <StatusBadge status="Passed" />,
    tanggal: "10 Oktober 2025",
  },
];

const DaftarKegiatan = () => {
  return (
    <ReusableTable
      title="Daftar Kegiatan HIMSI"
      description="Semua kegiatan yang telah dan akan diselenggarakan oleh HIMSI UBSI KLA dalam satu periode."
      headers={tableHeaders}
      data={kegiatanData}
      renderActions={(kegiatan) => (
        <Link
          href={`kegiatan/edit/${kegiatan.id}`} // Arahkan ke halaman edit kegiatan
          className="font-medium text-blue-600 hover:underline"
        >
          Edit
        </Link>
      )}
    />
  );
};

export default DaftarKegiatan;