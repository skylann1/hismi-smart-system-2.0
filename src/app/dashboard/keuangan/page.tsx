"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { hasAccess, ROLES } from "@/lib/roles";
import Link from "next/link";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiList } from "react-icons/fi";

export default function KeuanganPage() {
  const { user } = useAppSelector((state) => state);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch("/dashboard/api/keuangan/summary");
      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTreasurer = hasAccess(user.access, ROLES.BENDAHARA);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Keuangan HIMSI</h1>
          <p className="text-sm text-gray-600 mt-1">
            Sistem keuangan transparan untuk semua anggota
          </p>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Saldo Saat Ini</h3>
                  <FiDollarSign className="text-2xl opacity-75" />
                </div>
                <p className="text-3xl font-bold">
                  Rp {(summary?.balance || 0).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Pemasukan</h3>
                  <FiTrendingUp className="text-2xl opacity-75" />
                </div>
                <p className="text-3xl font-bold">
                  Rp {(summary?.totalIncome || 0).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Pengeluaran</h3>
                  <FiTrendingDown className="text-2xl opacity-75" />
                </div>
                <p className="text-3xl font-bold">
                  Rp {(summary?.totalExpense || 0).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Kas Saya - for all members */}
              <Link href="/dashboard/keuangan/kas/saya">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Kas Saya</h3>
                      <p className="text-sm text-gray-600">
                        Cek tunggakan kas pribadi
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Riwayat for All */}
              <Link href="/dashboard/keuangan/riwayat">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiList className="text-2xl text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Riwayat Keuangan</h3>
                      <p className="text-sm text-gray-600">
                        Lihat semua transaksi (transparan)
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Treasurer Only - These cards only show for bendahara */}
              {isTreasurer && (
                <>
                  <Link href="/dashboard/keuangan/transaksi">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FiTrendingUp className="text-2xl text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Kelola Transaksi
                          </h3>
                          <p className="text-sm text-gray-600">
                            Tambah pemasukan & pengeluaran
                          </p>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-1 inline-block">
                            Bendahara Only
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/keuangan/kas/anggota">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-orange-500">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FiList className="text-2xl text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Kas Anggota
                          </h3>
                          <p className="text-sm text-gray-600">
                            Kelola pembayaran kas anggota
                          </p>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-1 inline-block">
                            Bendahara Only
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informasi</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Kas bulanan: <strong>Rp 10,000</strong> per bulan</li>
                <li>• Semua anggota dapat melihat riwayat keuangan (transparan)</li>
                <li>• Hanya bendahara yang dapat mengelola transaksi</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div >
  );
}

