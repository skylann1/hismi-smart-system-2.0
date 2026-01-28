"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiPlus, FiDollarSign, FiCalendar, FiFileText, FiImage } from "react-icons/fi";
import { uploadImageViaAPI } from "@/lib/uploadHelper";

interface Transaction {
    id: string;
    tipe: "pemasukan" | "pengeluaran";
    judul: string;
    deskripsi: string;
    jumlah: number;
    tanggal: string;
    kategori: string;
    buktiUrl?: string;
    createdByName: string;
    createdAt: Date;
}

const KATEGORI_PEMASUKAN = [
    "Kas Anggota",
    "Donasi",
    "Sponsorship",
    "Penjualan",
    "Lainnya"
];

export default function PemasukanPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form states
    const [judul, setJudul] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [jumlah, setJumlah] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [kategori, setKategori] = useState("");
    const [buktiImage, setBuktiImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user.id || !hasAccess(user.access, ROLES.BENDAHARA)) {
            router.push("/dashboard");
            return;
        }
        fetchTransactions();
    }, [user, router]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/dashboard/api/keuangan/transaksi?tipe=pemasukan");
            const result = await response.json();

            if (result.success) {
                setTransactions(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBuktiImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!judul || !deskripsi || !jumlah || !tanggal || !kategori) {
            alert("Mohon lengkapi semua field yang wajib!");
            return;
        }

        setIsSubmitting(true);

        try {
            let buktiUrl = "";

            // Upload image if provided
            if (buktiImage) {
                const uploadResult = await uploadImageViaAPI(buktiImage, "transaction-proofs");
                if (uploadResult.success && uploadResult.url) {
                    buktiUrl = uploadResult.url;
                }
            }

            // Submit transaction
            const response = await fetch("/dashboard/api/keuangan/transaksi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tipe: "pemasukan",
                    judul,
                    deskripsi,
                    jumlah: Number(jumlah),
                    tanggal,
                    kategori,
                    buktiUrl,
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
                setBuktiImage(null);
                setShowForm(false);
                // Refresh transactions
                fetchTransactions();
            } else {
                alert(result.message || "Gagal menambahkan transaksi");
            }
        } catch (error) {
            console.error("Error submitting transaction:", error);
            alert("Terjadi kesalahan saat menambahkan transaksi");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Pemasukan Keuangan
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Kelola transaksi pemasukan organisasi
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <FiPlus />
                        Tambah Pemasukan
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Form Pemasukan Baru
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FiFileText className="inline mr-2" />
                                        Judul *
                                    </label>
                                    <input
                                        type="text"
                                        value={judul}
                                        onChange={(e) => setJudul(e.target.value)}
                                        placeholder="Contoh: Kas Bulan Januari"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FiDollarSign className="inline mr-2" />
                                        Jumlah (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        value={jumlah}
                                        onChange={(e) => setJumlah(e.target.value)}
                                        placeholder="10000"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi *
                                </label>
                                <textarea
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    placeholder="Deskripsi detail tentang pemasukan ini..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <FiCalendar className="inline mr-2" />
                                        Tanggal *
                                    </label>
                                    <input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {KATEGORI_PEMASUKAN.map((k) => (
                                            <option key={k} value={k}>{k}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiImage className="inline mr-2" />
                                    Bukti (Opsional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Menambahkan..." : "Tambah Pemasukan"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gray-600 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Transaction List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Riwayat Pemasukan
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-10 h-10 border-t-2 border-green-600 rounded-full animate-spin"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Belum ada transaksi pemasukan
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {transaction.judul}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {transaction.deskripsi}
                                            </p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                <span>📅 {transaction.tanggal}</span>
                                                <span>🏷️ {transaction.kategori}</span>
                                                <span>👤 {transaction.createdByName}</span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-xl font-bold text-green-600">
                                                +Rp {transaction.jumlah.toLocaleString("id-ID")}
                                            </p>
                                            {transaction.buktiUrl && (
                                                <a
                                                    href={transaction.buktiUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                                                >
                                                    Lihat Bukti
                                                </a>
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
