"use client";
import { useEffect, useState } from "react";
import { UserType } from "@/types";

export default function AdminPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/dashboard/api/users")
      .then(res => res.json())
      .then(json => {
        if (json.success) setUsers(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="opacity-90">Manage users and system settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Daftar Pengguna</h2>
        {loading ? (
          <div className="flex flex-col gap-3">
            <div className="animate-pulse h-10 bg-gray-100 rounded w-full"></div>
            <div className="animate-pulse h-10 bg-gray-100 rounded w-full"></div>
            <div className="animate-pulse h-10 bg-gray-100 rounded w-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Nama</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 rounded-tr-lg">Divisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-x border-b border-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.nama}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.divisi || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
