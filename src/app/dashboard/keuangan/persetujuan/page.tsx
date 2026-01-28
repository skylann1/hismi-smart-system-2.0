"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiCheck, FiX, FiEye, FiFilter } from "react-icons/fi";
import Image from "next/image";

interface Payment {
    id: string;
    userId: string;
    nama: string;
    nim: string;
    divisi: string;
    bulan: string;
    tahun: string;
    jumlah: number;
    buktiUrl: string;
    namaPengirim: string;
    tanggalTransfer: string;
    status: "pending" | "approved" | "rejected";
    keterangan?: string;
    createdAt: Date;
}

export default function PersetujuanPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [keterangan, setKeterangan] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!user.id || !hasAccess(user.access, ROLES.BENDAHARA)) {
            router.push("/dashboard");
            return;
        }
        fetchPayments();
    }, [user, router, statusFilter]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const url = statusFilter === "all"
                ? "/dashboard/api/keuangan/persetujuan"
                : `/dashboard/api/keuangan/persetujuan?status=${statusFilter}`;

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                setPayments(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = (payment: Payment) => {
        setSelectedPayment(payment);
        setKeterangan("");
        setShowModal(true);
    };

    const handleReject = (payment: Payment) => {
        setSelectedPayment(payment);
        setKeterangan("");
        setShowModal(true);
    };

    const confirmAction = async (status: "approved" | "rejected") => {
        if (!selectedPayment) return;

        setIsProcessing(true);

        try {
            const response = await fetch("/dashboard/api/keuangan/persetujuan", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentId: selectedPayment.id,
                    status,
                    keterangan,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                setShowModal(false);
                setSelectedPayment(null);
                setKeterangan("");
                fetchPayments();
            } else {
                alert(result.message || "Gagal memproses pembayaran");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Terjadi kesalahan saat memproses pembayaran");
        } finally {
            setIsProcessing(false);
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
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Persetujuan Pembayaran Kas
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Review dan setujui pembayaran kas bulanan dari anggota
                    </p>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <FiFilter className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                        {["all", "pending", "approved", "rejected"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as typeof statusFilter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === status
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {status === "all" ? "Semua" : getStatusText(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500">
                            Tidak ada pembayaran dengan status {statusFilter === "all" ? "apapun" : getStatusText(statusFilter)}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {payment.nama}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {payment.nim} • {payment.divisi}
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

                                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-600">Periode:</span>
                                                <p className="font-medium">{payment.bulan} {payment.tahun}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Jumlah:</span>
                                                <p className="font-medium">Rp {payment.jumlah.toLocaleString("id-ID")}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Pengirim:</span>
                                                <p className="font-medium">{payment.namaPengirim}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Tanggal Transfer:</span>
                                                <p className="font-medium">{payment.tanggalTransfer}</p>
                                            </div>
                                        </div>

                                        {payment.keterangan && (
                                            <div className="text-sm bg-gray-50 p-3 rounded-md">
                                                <span className="text-gray-600 font-medium">Keterangan:</span>
                                                <p className="text-gray-700 mt-1">{payment.keterangan}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 md:w-48">
                                        <button
                                            onClick={() => {
                                                setSelectedPayment(payment);
                                                setShowModal(true);
                                            }}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <FiEye />
                                            Lihat Bukti
                                        </button>

                                        {payment.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(payment)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    <FiCheck />
                                                    Setujui
                                                </button>
                                                <button
                                                    onClick={() => handleReject(payment)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                >
                                                    <FiX />
                                                    Tolak
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && selectedPayment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">Bukti Pembayaran</h2>

                                <div className="mb-4">
                                    <Image
                                        src={selectedPayment.buktiUrl}
                                        alt="Bukti pembayaran"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto rounded-lg border border-gray-300"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Keterangan (Opsional)
                                    </label>
                                    <textarea
                                        value={keterangan}
                                        onChange={(e) => setKeterangan(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                        rows={3}
                                        placeholder="Tambahkan catatan jika diperlukan..."
                                    />
                                </div>

                                {selectedPayment.status === "pending" ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => confirmAction("approved")}
                                            disabled={isProcessing}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? "Memproses..." : "Setujui"}
                                        </button>
                                        <button
                                            onClick={() => confirmAction("rejected")}
                                            disabled={isProcessing}
                                            className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? "Memproses..." : "Tolak"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                setSelectedPayment(null);
                                                setKeterangan("");
                                            }}
                                            disabled={isProcessing}
                                            className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedPayment(null);
                                            setKeterangan("");
                                        }}
                                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
