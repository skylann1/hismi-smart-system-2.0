"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiEdit, FiTrash2, FiDownload } from "react-icons/fi";

interface Transaction {
    id: string;
    tipe: "pemasukan" | "pengeluaran";
    judul: string;
    deskripsi: string;
    jumlah: number;
    tanggal: string;
    kategori: string;
    createdByName: string;
    createdAt: Date;
}

export default function RiwayatKeuanganPage() {
    const { user } = useAppSelector((state) => state);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pemasukan" | "pengeluaran">("all");

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [transactionsRes, summaryRes] = await Promise.all([
                fetch(`/dashboard/api/keuangan/transaksi${filter !== "all" ? `?tipe=${filter}` : ""}`),
                fetch("/dashboard/api/keuangan/summary"),
            ]);

            const [transactionsData, summaryData] = await Promise.all([
                transactionsRes.json(),
                summaryRes.json(),
            ]);

            if (transactionsData.success) {
                setTransactions(transactionsData.data || []);
            }

            if (summaryData.success) {
                setSummary(summaryData.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

        try {
            const response = await fetch(`/dashboard/api/keuangan/transaksi/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (result.success) {
                alert("Transaksi berhasil dihapus");
                fetchData();
            } else {
                alert(result.message || "Gagal menghapus");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan");
        }
    };

    const isTreasurer = hasAccess(user.access, ROLES.BENDAHARA);

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Riwayat Keuangan
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Laporan keuangan transparan untuk semua anggota
                    </p>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Saldo Saat Ini</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                Rp {(summary.balance || 0).toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Pemasukan</h3>
                            <p className="text-3xl font-bold text-green-600">
                                +Rp {(summary.totalIncome || 0).toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Pengeluaran</h3>
                            <p className="text-3xl font-bold text-red-600">
                                -Rp {(summary.totalExpense || 0).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons for Treasurer */}
                {isTreasurer && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800 mb-3 font-medium">Mode Bendahara</p>
                        <div className="flex gap-3 flex-wrap">
                            <a
                                href="/dashboard/keuangan/transaksi"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                + Tambah Transaksi
                            </a>
                            <a
                                href="/dashboard/keuangan"
                                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                                Dashboard Keuangan
                            </a>
                        </div>
                    </div>
                )}

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                        {["all", "pemasukan", "pengeluaran"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as typeof filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {f === "all" ? "Semua" : f === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transaction List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Daftar Transaksi
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Belum ada transaksi
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0 ${transaction.tipe === "pemasukan"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                        }`}
                                                >
                                                    {transaction.tipe === "pemasukan" ? "↑" : "↓"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-800 text-lg">
                                                        {transaction.judul}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {transaction.deskripsi}
                                                    </p>
                                                    <div className="flex gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                                                        <span>📅 {transaction.tanggal}</span>
                                                        <span>🏷️ {transaction.kategori}</span>
                                                        <span>👤 {transaction.createdByName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 flex-shrink-0">
                                            <div className="text-right">
                                                <p
                                                    className={`text-xl font-bold ${transaction.tipe === "pemasukan"
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                        }`}
                                                >
                                                    {transaction.tipe === "pemasukan" ? "+" : "-"}Rp{" "}
                                                    {transaction.jumlah.toLocaleString("id-ID")}
                                                </p>
                                            </div>

                                            {/* Edit/Delete buttons for treasurer */}
                                            {isTreasurer && (
                                                <div className="flex gap-2">
                                                    <a
                                                        href={`/dashboard/keuangan/${transaction.tipe}/edit/${transaction.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FiEdit className="text-lg" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
