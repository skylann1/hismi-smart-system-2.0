"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";

interface Transaction {
    id: string;
    tipe: "pemasukan" | "pengeluaran";
    judul: string;
    jumlah: number;
    tanggal: string;
    kategori: string;
}

export default function TransaksiPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    const [tipe, setTipe] = useState<"pemasukan" | "pengeluaran">("pemasukan");
    const [judul, setJudul] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [jumlah, setJumlah] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [kategori, setKategori] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

    const KATEGORI_PEMASUKAN = ["Kas Anggota", "Donasi", "Sponsorship", "Penjualan", "Lainnya"];
    const KATEGORI_PENGELUARAN = ["Konsumsi", "Transport", "ATK", "Dekorasi", "Hadiah", "Donasi", "Lainnya"];

    useEffect(() => {
        if (!user.id || !hasAccess(user.access, ROLES.BENDAHARA)) {
            router.push("/dashboard");
            return;
        }
        fetchRecentTransactions();
    }, [user, router]);

    const fetchRecentTransactions = async () => {
        try {
            const response = await fetch("/dashboard/api/keuangan/transaksi");
            const result = await response.json();
            if (result.success) {
                const sorted = (result.data || []).sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setRecentTransactions(sorted.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!judul || !deskripsi || !jumlah || !tanggal || !kategori) {
            alert("Mohon lengkapi semua field!");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/dashboard/api/keuangan/transaksi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipe,
                    judul,
                    deskripsi,
                    jumlah: Number(jumlah),
                    tanggal,
                    kategori,
                    buktiUrl: "",
                    createdBy: user.id,
                    createdByName: user.nama,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                // Reset form
                setJudul("");
                setDeskripsi("");
                setJumlah("");
                setTanggal("");
                setKategori("");
                fetchRecentTransactions();
            } else {
                alert(result.message || "Gagal menambahkan transaksi");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Tambah Transaksi
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Catat pemasukan & pengeluaran organisasi
                        </p>
                    </div>
                    <Link
                        href="/dashboard/keuangan/riwayat"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                        Lihat Riwayat
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Tipe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipe Transaksi *
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setTipe("pemasukan")}
                                    className={`flex-1 py-3 rounded-md font-medium transition-colors ${tipe === "pemasukan"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    ↑ Pemasukan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTipe("pengeluaran")}
                                    className={`flex-1 py-3 rounded-md font-medium transition-colors ${tipe === "pengeluaran"
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    ↓ Pengeluaran
                                </button>
                            </div>
                        </div>

                        {/* Judul & Jumlah */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text text-gray-700 mb-1">
                                    Judul *
                                </label>
                                <input
                                    type="text"
                                    value={judul}
                                    onChange={(e) => setJudul(e.target.value)}
                                    placeholder="Contoh: Kas Bulan Januari"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah (Rp) *
                                </label>
                                <input
                                    type="number"
                                    value={jumlah}
                                    onChange={(e) => setJumlah(e.target.value)}
                                    placeholder="10000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi *
                            </label>
                            <textarea
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                placeholder="Detail transaksi..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                rows={3}
                                required
                            />
                        </div>

                        {/* Tanggal & Kategori */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal *
                                </label>
                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori *
                                </label>
                                <select
                                    value={kategori}
                                    onChange={(e) => setKategori(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {(tipe === "pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN).map((k) => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <FiPlus />
                                    Simpan Transaksi
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Transaksi Terbaru
                        </h2>
                        <button
                            onClick={fetchRecentTransactions}
                            className="text-gray-600 hover:text-primary transition-colors"
                        >
                            <FiRefreshCw />
                        </button>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">Belum ada transaksi</p>
                    ) : (
                        <div className="space-y-2">
                            {recentTransactions.map((t) => (
                                <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{t.judul}</p>
                                        <p className="text-xs text-gray-500">{t.tanggal} • {t.kategori}</p>
                                    </div>
                                    <p className={`font-bold text-sm ${t.tipe === "pemasukan" ? "text-green-600" : "text-red-600"}`}>
                                        {t.tipe === "pemasukan" ? "+" : "-"}Rp {t.jumlah.toLocaleString("id-ID")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
