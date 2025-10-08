import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable"; // Pastikan path ini benar
import Link from "next/link";

// --- Helper Components & Icons ---
const ManualIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><path d="M18 2 22 6"/><path d="m15 5 3 3"/></svg>;
const QRIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

const tableHeaders: TableHeader[] = [
  { key: "title", label: "Judul Acara" },
  { key: "type", label: "Tipe" },
  { key: "lokasi", label: "Lokasi" },
  { key: "waktu", label: "Waktu" },
  { key: "status", label: "Status" },
];

// Tipe data untuk jenis dan status acara
type AcaraType = "Pertemuan" | "Kegiatan" | "Acara";
type AcaraStatus = "Selesai" | "Belum Selesai";

const TypeBadge = ({ type }: { type: AcaraType }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  
  switch (type) {
    case "Pertemuan":
      return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Pertemuan</span>;
    case "Kegiatan":
      return <span className={`${baseClasses} bg-sky-100 text-sky-800`}>Kegiatan</span>;
    case "Acara":
      return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>Acara</span>;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: AcaraStatus }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    if (status === "Selesai") {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Selesai</span>;
    }
    return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Belum Selesai</span>;
};

const acaraData: TableRow[] = [
  {
    id: "evt-001",
    title: "Rapat Bulanan BPH & Koordinator",
    type: <TypeBadge type="Pertemuan" />,
    lokasi: "Sekretariat HIMSI",
    waktu: "30 Jul 2025, 19:00 WIB",
    status: <StatusBadge status="Selesai" />,
  },
  {
    id: "evt-002",
    title: "Workshop Desain Grafis",
    type: <TypeBadge type="Kegiatan" />,
    lokasi: "Lab Komputer",
    waktu: "15 Sep 2025, 09:00 WIB",
    status: <StatusBadge status="Belum Selesai" />,
  },
  {
    id: "evt-003",
    title: "Makrab (Malam Keakraban)",
    type: <TypeBadge type="Acara" />,
    lokasi: "Villa Puncak",
    waktu: "20 Okt 2025, 13:00 WIB",
    status: <StatusBadge status="Belum Selesai" />,
  },
  {
    id: "evt-004",
    title: "Diskusi Panel: Karir di Bidang IT",
    type: <TypeBadge type="Kegiatan" />,
    lokasi: "Aula Kampus",
    waktu: "10 Jul 2025, 10:00 WIB",
    status: <StatusBadge status="Selesai" />,
  },
];

const KelolaAbsensiPage = () => {
  return (
    <ReusableTable
      title="Kelola Absensi Acara"
      description="Pilih acara untuk melakukan absensi anggota secara manual atau menggunakan QR code."
      headers={tableHeaders}
      data={acaraData}
      renderActions={(acara) => (
        <div className="flex items-center gap-4">
          <Link
            href={`absen/manual/${acara.id}`}
            className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            <ManualIcon />
            Manual
          </Link>
          <Link
            href={`absen/scanning/tutorial/${acara.id}`}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <QRIcon />
            QR
          </Link>
        </div>
      )}
    />
  );
};

export default KelolaAbsensiPage;
