"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PaslonType } from "@/types";
import Image from "next/image";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";

export default function Page() {
  const dispatch = useAppDispatch();
  const [paslons, setPaslons] = useState<PaslonType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const getData = async () => {
      try {
        // Asumsi endpoint API lu di /api/paslon
        const res = await fetch(
          `/dashboard/api/pemilu/paslon`
        );
        const data = await res.json();
        if (data.success) {
          // Sort berdasarkan nomor urut biar rapi
          const sortedData = data.data.sort(
            (a: PaslonType, b: PaslonType) => a.nomor_urut - b.nomor_urut
          );
          setPaslons(sortedData);
        }
      } catch (error) {
        console.error("Gagal ambil data paslon", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // FUNCTION DELETE
  const handleDelete = async (id: string) => {
    // 1. Konfirmasi dulu
    const confirm = window.confirm(
      "Apakah anda yakin ingin menghapus Paslon ini? Data dan foto akan hilang permanen."
    );
    if (!confirm) return;

    try {
      // 2. Call API
      const res = await fetch(`/dashboard/api/pemilu/paslon/delete?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      // 3. Handle Response
      if (result.success) {
        // Tampilkan Alert Sukses
        dispatch(
          alertIsAktif({
            status: true,
            title: "Deleted!",
            message: result.message,
          })
        );

        // 4. Update UI (Hapus item dari tabel tanpa reload page)
        setPaslons((prev) => prev.filter((item) => item.id !== id));
      } else {
        throw new Error(result.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(
        alertIsAktif({
          status: true,
          title: "Gagal",
          message: error.message || "Gagal menghapus data",
        })
      );
    }
  };

  if (!isMounted) return null;

  console.log("PASLON DATA:", paslons);

  return (
    <div className="shadow-md rounded-md sm:rounded-lg overflow-hidden min-h-screen bg-white">
      {/* HEADER */}
      <div className="p-5 text-lg text-gray-900 font-bold flex justify-between items-end bg-white border-b">
        <div>
          Daftar Paslon
          <p className="font-normal mt-1 text-xs sm:text-sm text-gray-500">
            Kandidat Ketua & Wakil Himpunan periode ini.
          </p>
        </div>
        <Link
          href="/dashboard/settings/pemilu/kandidat/tambah" 
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah Paslon
        </Link>
      </div>

      {/* TABLE */}
      <div className="relative overflow-x-auto bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-center w-16">No. Urut</th>
              <th className="px-6 py-3">Kandidat (Ketua & Wakil)</th>
              <th className="px-6 py-3">Tagline</th>
              <th className="px-6 py-3 text-right">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && paslons.length > 0
              ? paslons.map((paslon) => (
                  <tr
                    key={paslon.id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    {/* KOLOM 1: NOMOR URUT */}
                    <th
                      scope="row"
                      className="px-6 py-4 font-bold text-gray-900 text-center text-lg"
                    >
                      {paslon.nomor_urut}
                    </th>

                    {/* KOLOM 2: INFO KANDIDAT & FOTO */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {/* Wrapper Foto */}
                        <div className="flex -space-x-3">
                          {/* Foto Ketua */}
                          <Image
                            width={500}
                            height={500}
                            src={paslon.ketua.foto || ""}
                            alt="Ketua"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                          />
                          {/* Foto Wakil */}
                          <Image
                            width={500}
                            height={500}
                            src={paslon.wakil.foto || ""}
                            alt="Wakil"
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                          />
                        </div>
                        {/* Nama */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {paslon.ketua.nama}
                          </span>
                          <span className="text-xs text-gray-500">
                            & {paslon.wakil.nama}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* KOLOM 3: TAGLINE */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {paslon.tagline}
                    </td>

                    {/* KOLOM 4: ACTION */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/settings/pemilu/kandidat/edit/${paslon.id}`}
                        className="font-medium text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        className="font-medium text-red-600 hover:underline"
                        onClick={() => handleDelete(paslon.id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : // SKELETON LOADING
                isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr
                    key={i}
                    className="bg-white border-b border-gray-200 animate-pulse"
                  >
                    <td className="px-6 py-4 text-center">
                      <div className="w-6 h-6 bg-gray-200 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-32 h-3 bg-gray-200 rounded"></div>
                          <div className="w-20 h-2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-48 h-4 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-10 h-4 bg-gray-200 rounded ml-auto"></div>
                    </td>
                  </tr>
                ))}

            {/* Empty State */}
            {!isLoading && paslons.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Belum ada data paslon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
