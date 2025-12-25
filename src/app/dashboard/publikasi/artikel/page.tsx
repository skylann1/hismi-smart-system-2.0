"use client";

import ReusableTable, {
  type TableHeader,
  type TableRow,
} from "@/components/ui/moleculs/table/PrimaryTable";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import type { FormBlog } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";

const tableHeaders: TableHeader[] = [
  { key: "judul", label: "Judul Berita" },
  { key: "kategori", label: "Kategori" },
  { key: "author", label: "Author" },
  { key: "tanggal", label: "Tanggal" },
  { key: "status", label: "Status" },
];

const ListArtikel = () => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/publikasi/blog`;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<TableRow[]>([]);

  const onAddClick = () => {
    router.push("/dashboard/publikasi/artikel/tambah");
  };

  useEffect(() => {
    try {
      const tryToFetch = async () => {
        setIsLoading(true);
        const res = await fetch(url, {
          cache: "no-store",
        });

        const data = await res.json();
        if (!data.success) {
          console.error(data?.message);
        }

        setBlogs(data.data);
      };

      tryToFetch();
    } catch {
      console.error("Oops! something when wrong in the server.");
    } finally {
      setIsLoading(false);
    }
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
        <>
          {blogs.length === 0 ? (
            <div className="w-full bg-white h-[75vh] flex flex-col justify-center items-center gap-x-10 p-6">
              not found any berita. please{" "}
            </div>
          ) : (
            <ReusableTable
              title="Daftar Berita"
              description="Semua berita yang sudah dibuat akan muncul di sini. Bisa dikelola oleh admin/editor."
              headers={tableHeaders}
              data={blogs}
              onAddClick={onAddClick}
              renderActions={(news) => (
                <div className="flex gap-3">
                  <Link
                    href={`artikel/edit/${news.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`artikel/news/delete/${news.id}`}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </Link>
                </div>
              )}
            />
          )}
        </>
      )}
    </>
  );
};

export default ListArtikel;
