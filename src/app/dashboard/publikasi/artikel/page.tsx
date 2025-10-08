"use client";

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1. Definisikan header news
const tableHeaders: TableHeader[] = [
  { key: "title", label: "Judul Berita" },
  { key: "category", label: "Kategori" },
  { key: "author", label: "Author" },
  { key: "date", label: "Tanggal" },
  { key: "status", label: "Status" },
];

// Tipe data untuk status berita
type NewsStatus = "Published" | "Draft";

// 2. Komponen Badge untuk status berita
const StatusBadge = ({ status }: { status: NewsStatus }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";

  switch (status) {
    case "Published":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Published
        </span>
      );
    case "Draft":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Draft
        </span>
      );
    default:
      return null;
  }
};

// 3. Data dummy news
const newsData: TableRow[] = [
  {
    id: "news-01",
    title: "Teknologi AI Membantu Dunia Medis",
    category: "Teknologi",
    author: "Admin",
    date: "11 September 2025",
    status: <StatusBadge status="Published" />,
  },
  {
    id: "news-02",
    title: "Event Seminar HIMSI Akan Datang",
    category: "Event",
    author: "Editor",
    date: "10 September 2025",
    status: <StatusBadge status="Draft" />,
  },
  {
    id: "news-03",
    title: "Tips Belajar Web Development",
    category: "Pendidikan",
    author: "Admin",
    date: "9 September 2025",
    status: <StatusBadge status="Published" />,
  },
];

// 4. Table News
const ListArtikel = () => {
  const router = useRouter();

  const onAddClick = () => {
    router.push("/dashboard/publikasi/artikel/tambah");
  };

  return (
    <ReusableTable
      title="Daftar Berita"
      description="Semua berita yang sudah dibuat akan muncul di sini. Bisa dikelola oleh admin/editor."
      headers={tableHeaders}
      data={newsData}
      onAddClick={onAddClick}
      renderActions={(news) => (
        <div className="flex gap-3">
          <Link
            href={`news/edit/${news.id}`}
            className="font-medium text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <Link
            href={`news/delete/${news.id}`}
            className="font-medium text-red-600 hover:underline"
          >
            Delete
          </Link>
        </div>
      )}
    />
  );
};

export default ListArtikel;
