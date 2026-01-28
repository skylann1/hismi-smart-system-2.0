"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";

interface MemberSummary {
  userId: string;
  nama: string;
  nim: string;
  divisi: string;
  monthsPaid: number;
  monthsUnpaid: number;
  debt: number;
}

export default function KasAnggotaPage() {
  const { user } = useAppSelector((state) => state);
  const router = useRouter();
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user.id || !hasAccess(user.access, ROLES.BENDAHARA)) {
      router.push("/dashboard");
      return;
    }
    fetchMembers();
  }, [user, router]);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/dashboard/api/keuangan/kas/anggota");
      const result = await response.json();
      if (result.success) {
        setMembers(result.data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nim.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Kas Anggota
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kelola pembayaran kas bulanan anggota (Rp 10,000/bulan)
            </p>
          </div>
          <a
            href="/dashboard/api/keuangan/kas/export?type=summary"
            download
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <span>📊</span>
            Download Excel
          </a>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="Cari nama atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Member List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? "Tidak ada anggota yang cocok" : "Belum ada data kas anggota"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      NIM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Divisi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Lunas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Belum Bayar
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      Tunggakan
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member, index) => (
                    <tr key={member.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {member.nama}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.nim}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.divisi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-green-600">
                          {member.monthsPaid} bulan
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-orange-600">
                          {member.monthsUnpaid} bulan
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-bold ${member.debt > 0 ? "text-red-600" : "text-green-600"}`}>
                          {member.debt > 0 ? `-Rp ${member.debt.toLocaleString("id-ID")}` : "Lunas"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          href={`/dashboard/keuangan/kas/anggota/${member.userId}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          <FiEdit />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {!isLoading && members.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📊 Ringkasan</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Anggota:</span>
                <span className="font-bold text-blue-900 ml-2">{members.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Total Tunggakan:</span>
                <span className="font-bold text-red-600 ml-2">
                  Rp {members.reduce((sum, m) => sum + m.debt, 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Anggota Menunggak:</span>
                <span className="font-bold text-orange-600 ml-2">
                  {members.filter((m) => m.debt > 0).length} orang
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
