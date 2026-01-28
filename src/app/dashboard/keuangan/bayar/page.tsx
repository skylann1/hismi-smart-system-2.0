"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { uploadImageViaAPI } from "@/lib/uploadHelper";
import { FiUpload, FiCalendar, FiDollarSign, FiUser, FiImage } from "react-icons/fi";

interface PaymentHistory {
    id: string;
    bulan: string;
    tahun: string;
    jumlah: number;
    status: "pending" | "approved" | "rejected";
    tanggalTransfer: string;
    keterangan?: string;
    createdAt: Date;
}

const BULAN_OPTIONS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const STANDARD_AMOUNT = 10000;

export default function BayarKasPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState(new Date().getFullYear().toString());
    const [jumlah, setJumlah] = useState(STANDARD_AMOUNT);
    const [namaPengirim, setNamaPengirim] = useState("");
    const [tanggalTransfer, setTanggalTransfer] = useState("");
    const [buktiImage, setBuktiImage] = useState<File | null>(null);
    const [buktiPreview, setBuktiPreview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user.id) {
            router.push("/login");
            return;
        }
        fetchPaymentHistory();
    }, [user.id, router]);

    const fetchPaymentHistory = async () => {
        try {
            const response = await fetch(`/dashboard/api/keuangan/bayar?userId=${user.id}`);
            const result = await response.json();

            if (result.success) {
                setPaymentHistory(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching payment history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBuktiImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBuktiPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bulan || !tahun || !namaPengirim || !tanggalTransfer || !buktiImage) {
            alert("Mohon lengkapi semua field!");
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload image to Supabase
            const uploadResult = await uploadImageViaAPI(buktiImage, "payment-proofs");

            if (!uploadResult.success || !uploadResult.url) {
                alert("Gagal mengupload bukti pembayaran");
                setIsSubmitting(false);
                return;
            }

            // Submit payment
            const response = await fetch("/dashboard/api/keuangan/bayar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    nama: user.nama,
                    nim: user.nim,
                    divisi: user.divisi,
                    bulan,
                    tahun,
                    jumlah,
                    buktiUrl: uploadResult.url,
                    namaPengirim,
                    tanggalTransfer,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                // Reset form
                setBulan("");
                setTahun(new Date().getFullYear().toString());
                setJumlah(STANDARD_AMOUNT);
                setNamaPengirim("");
                setTanggalTransfer("");
                setBuktiImage(null);
                setBuktiPreview("");
                // Refresh history
                fetchPaymentHistory();
            } else {
                alert(result.message || "Gagal submit pembayaran");
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
            alert("Terjadi kesalahan saat submit pembayaran");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return badges[status as keyof typeof badges] || badges.pending;
    };

    const getStatusText = (status: string) => {
        const texts = {
            pending: "Menunggu",
            approved: "Disetujui",
            rejected: "Ditolak",
        };
        return texts[status as keyof typeof texts] || status;
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Pembayaran Kas Bulanan
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Submit bukti pembayaran kas bulanan Anda di sini
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Form Pembayaran
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiCalendar className="inline mr-2" />
                                    Bulan
                                </label>
                                <select
                                    value={bulan}
                                    onChange={(e) => setBulan(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                >
                                    <option value="">Pilih Bulan</option>
                                    {BULAN_OPTIONS.map((b) => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiCalendar className="inline mr-2" />
                                    Tahun
                                </label>
                                <input
                                    type="number"
                                    value={tahun}
                                    onChange={(e) => setTahun(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    min="2020"
                                    max="2030"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiDollarSign className="inline mr-2" />
                                    Jumlah
                                </label>
                                <input
                                    type="number"
                                    value={jumlah}
                                    onChange={(e) => setJumlah(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Standar pembayaran: Rp {STANDARD_AMOUNT.toLocaleString("id-ID")}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiUser className="inline mr-2" />
                                    Nama Pengirim
                                </label>
                                <input
                                    type="text"
                                    value={namaPengirim}
                                    onChange={(e) => setNamaPengirim(e.target.value)}
                                    placeholder="Nama yang tertera di bukti transfer"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiCalendar className="inline mr-2" />
                                    Tanggal Transfer
                                </label>
                                <input
                                    type="date"
                                    value={tanggalTransfer}
                                    onChange={(e) => setTanggalTransfer(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiImage className="inline mr-2" />
                                    Bukti Pembayaran (Screenshot/Foto)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                                {buktiPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={buktiPreview}
                                            alt="Preview bukti"
                                            className="max-w-full h-auto max-h-64 rounded-md border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FiUpload />
                                        Submit Pembayaran
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Riwayat Pembayaran
                        </h2>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
                            </div>
                        ) : paymentHistory.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                Belum ada riwayat pembayaran
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {paymentHistory.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {payment.bulan} {payment.tahun}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Rp {payment.jumlah.toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                                    payment.status
                                                )}`}
                                            >
                                                {getStatusText(payment.status)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <p>Transfer: {payment.tanggalTransfer}</p>
                                            {payment.keterangan && (
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Keterangan:</span>{" "}
                                                    {payment.keterangan}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
