"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NotulensiFormData } from "@/types";

export default function NotulensiPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/dashboard/api/notulensi")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Notulensi</h1>
        <Link href="/dashboard/notulensi/tambah" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
          Tambah Notulensi
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.length === 0 ? <p className="text-gray-500">Belum ada notulensi.</p> : data.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2 uppercase font-semibold tracking-wide">{item.kategori}</span>
            <h3 className="font-bold text-lg mb-1">{item.judul}</h3>
            <p className="text-gray-500 text-sm mb-4">{item.tanggal} • {item.author || "Admin"}</p>
            <div className="prose prose-sm text-gray-600 line-clamp-3">
              {item.isi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}