"use client";

import { useEffect, useState } from "react";
import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const tableHeaders: TableHeader[] = [
  { key: "judul", label: "Judul Pertemuan" },
  { key: "lokasi", label: "Lokasi" },
  { key: "status", label: "Status" },
  { key: "tanggal", label: "Tanggal" },
];

const StatusBadge = ({ status }: { status: "Upcoming" | "Passed" | "Ongoing" }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  if (status === "Upcoming") {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
        Upcoming
      </span>
    );
  } else if (status === "Ongoing") {
    return (
      <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
        Ongoing
      </span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Passed</span>
  );
};

const DaftarPertemuan = () => {
  // Fetch data from the server or any other asynchronous operation
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/pertemuan`;
  const [data, setData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  type Pertemuan = {
    id: string | number;
    judul: string;
    lokasi?: string;
    status: "Upcoming" | "Passed" | "Ongoing";
    tanggal?: string;
    [key: string]: unknown;
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pertemuan ini?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/pertemuan/delete?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Pertemuan berhasil dihapus");
        window.location.reload();
      } else {
        alert("Gagal menghapus pertemuan: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting pertemuan:", error);
      alert("Terjadi kesalahan saat menghapus pertemuan");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url, { cache: "no-store" });
        const json = await response.json();
        const rawData = json.data as Pertemuan[];

        if (!response.ok) throw new Error("Failed to fetch data");

        const mappedData: TableRow[] = rawData.map((item: Pertemuan) => ({
          id: item.id,
          judul: item.judul,
          lokasi: item.lokasi ?? "",
          status: <StatusBadge status={item.status} />,
          tanggal: item.tanggal ?? "",
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return (
    <>
      {isLoading ? (
        <div className="w-full bg-white h-[75vh] flex flex-col justify-center items-center gap-6 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex flex-col items-center"
          >
            <Image
              src="/assets/undraw/on-the-way.svg"
              alt="Loading illustration"
              width={300}
              height={300}
              className="w-[60%] lg:w-[40%] animate-pulse"
            />
            <motion.div
              className="mt-6 text-gray-600 text-lg font-semibold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Loading data, please wait...
            </motion.div>
            <motion.div
              className="mt-4 flex gap-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full delay-150"></div>
              <div className="w-3 h-3 bg-primary rounded-full delay-300"></div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <ReusableTable
          title="Daftar Jadwal Pertemuan"
          description="Semua jadwal pertemuan dan acara HIMSI UBSI KLA. Jadwal yang sudah lewat akan ditandai sebagai 'Passed'."
          headers={tableHeaders}
          data={data}
          renderActions={(pertemuan) => (
            <div className="flex gap-3">
              <Link
                href={`pertemuan/edit/${pertemuan.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(pertemuan.id)}
                className="font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        />
      )}
    </>
  );
};

export default DaftarPertemuan;
