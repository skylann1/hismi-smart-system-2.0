"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { UserType } from "@/types";

export default function Page() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/anggota/delete?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        alert("Anggota berhasil dihapus");
        window.location.reload();
      } else {
        alert("Gagal menghapus anggota: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting anggota:", error);
      alert("Terjadi kesalahan saat menghapus anggota");
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const getData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/anggota`
        );
        const data = await res.json();
        if (data.success) setUsers(data.data);
      } catch {
        console.log("error");
      }
    };
    getData();
  }, []);

  return (
    <div className="shadow-md rounded-md sm:rounded-lg overflow-hidden h-screen bg-white">
      <div className="p-5 text-lg text-gray-900 font-bold flex justify-between items-end bg-white">
        <div>
          Daftar Anggota
          <p className="font-normal mt-1 text-xs sm:text-sm text-gray-500">
            Daftar anggota HIMSI UBSI KLA satu periode, dan pastikan update
            untuk setiap priode nya.
          </p>
        </div>
      </div>

      <div className="relative overflow-x-auto mt-4 bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Nim</th>
              <th className="px-6 py-3">No telepon</th>
              <th className="px-6 py-3">Divisi</th>
              <th className="px-6 py-3">Jabatan</th>
              <th className="px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0
              ? users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white border-b border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {user.nama}
                  </th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.nim}</td>
                  <td className="px-6 py-4">{user.no_hp}</td>
                  <td className="px-6 py-4">{user.divisi}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 text-right flex gap-2">
                    <Link
                      href={`/dashboard/anggota/edit/${user.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
              : // skeleton hanya muncul di client (avoid hydration mismatch)
              isMounted &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  className="bg-white border-b border-gray-200 animate-pulse"
                >
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="w-24 h-4 bg-gray-200 rounded-sm"></div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
