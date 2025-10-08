"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React from "react";

// --- Tipe Data ---
type AbsensiStatus = "Aman" | "Warning" | "Dropout";
type KehadiranStatus = "Hadir" | "Tidak Hadir";

interface RiwayatAbsensi {
  tanggal: string;
  judulPertemuan: string;
  status: KehadiranStatus;
}

interface AnggotaDetail {
  id: string;
  nama: string;
  divisi: string;
  jabatan: string;
  imageUrl: string;
  hadir: number;
  tidakHadir: number;
  riwayat: RiwayatAbsensi[];
}

// --- Data Dummy (untuk simulasi) ---
const dummyDetailData: { [key: string]: AnggotaDetail } = {
  "abs-001": {
    id: "abs-001",
    nama: "Ahmad Subarjo",
    divisi: "Pendidikan",
    jabatan: "Koordinator",
    imageUrl: "https://placehold.co/100x100/a2d2ff/ffffff?text=AS",
    hadir: 8,
    tidakHadir: 4,
    riwayat: [
      { tanggal: "2025-08-20", judulPertemuan: "Rapat Bulanan", status: "Hadir" },
      { tanggal: "2025-08-15", judulPertemuan: "Persiapan Makrab", status: "Tidak Hadir" },
      { tanggal: "2025-08-10", judulPertemuan: "Evaluasi Proker", status: "Hadir" },
      { tanggal: "2025-08-05", judulPertemuan: "Diskusi Internal", status: "Tidak Hadir" },
    ],
  },
  // Tambahkan data untuk ID lain jika diperlukan
};

// --- Komponen Badge ---
const StatusBadge = ({ status }: { status: AbsensiStatus }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  switch (status) {
    case "Warning": return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Warning</span>;
    case "Dropout": return <span className={`${baseClasses} bg-red-100 text-red-800`}>Dropout</span>;
    case "Aman": return <span className={`${baseClasses} bg-green-100 text-green-800`}>Aman</span>;
    default: return null;
  }
};

const KehadiranBadge = ({ status }: { status: KehadiranStatus }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    if (status === "Hadir") {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Hadir</span>;
    }
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>Tidak Hadir</span>;
};


export default function DetailAbsensiPage() {
  const params = useParams();
  const id = params.id as string;
  const anggota = dummyDetailData[id]; // Di aplikasi nyata, ini akan menjadi fetch API

  if (!anggota) {
    return <div className="p-8">Anggota tidak ditemukan.</div>;
  }

  // Hitung status berdasarkan jumlah tidak hadir
  let status: AbsensiStatus = "Aman";
  if (anggota.tidakHadir >= 5) {
    status = "Dropout";
  } else if (anggota.tidakHadir >= 3) {
    status = "Warning";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Kartu Profil Anggota */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row">
            <Image
              src={""}
              alt={anggota.nama}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{anggota.nama}</h1>
              <p className="text-md text-gray-600">{anggota.jabatan}, Divisi {anggota.divisi}</p>
              <div className="mt-3">
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Kehadiran */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Hadir</p>
            <p className="mt-1 text-3xl font-semibold text-green-600">{anggota.hadir}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Tidak Hadir</p>
            <p className="mt-1 text-3xl font-semibold text-red-600">{anggota.tidakHadir}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Total Pertemuan</p>
            <p className="mt-1 text-3xl font-semibold text-gray-800">{anggota.hadir + anggota.tidakHadir}</p>
          </div>
        </div>

        {/* Riwayat Absensi */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Riwayat Kehadiran</h2>
            <div className="mt-4 flow-root">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tanggal</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Judul Pertemuan</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {anggota.riwayat.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{item.tanggal}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800">{item.judulPertemuan}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><KehadiranBadge status={item.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
