"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

interface MyPayment {
    id: string;
    bulan: string;
    jumlah: number;
    isPaid: boolean;
    paidAt?: Date;
}

export default function KasSayaPage() {
    const { user } = useAppSelector((state) => state);
    const [payments, setPayments] = useState<MyPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user.id) {
            fetchMyKas();
        }
    }, [user.id]);

    const fetchMyKas = async () => {
        try {
            const response = await fetch(`/dashboard/api/keuangan/kas/saya?userId=${user.id}`);
            const result = await response.json();
            if (result.success) {
                setPayments(result.data || []);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMonth = (bulan: string) => {
        const [year, month] = bulan.split("-");
        const months = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        return `${months[parseInt(month)]} ${year}`;
    };

    // Get current month for real-time calculation
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const paidPayments = payments.filter((p) => p.isPaid);

    // Only count past/current months as unpaid (real-time)
    const unpaidPayments = payments.filter((p) => !p.isPaid && p.bulan <= currentMonth);

    // All unpaid for display
    const allUnpaidPayments = payments.filter((p) => !p.isPaid);

    const totalDebt = unpaidPayments.reduce((sum, p) => sum + p.jumlah, 0);

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Kas Saya
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Lihat status pembayaran kas bulanan Anda
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                                <h3 className="text-sm font-medium opacity-90 mb-2">Sudah Bayar</h3>
                                <p className="text-3xl font-bold">{paidPayments.length}</p>
                                <p className="text-xs opacity-75 mt-1">bulan lunas</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                                <h3 className="text-sm font-medium opacity-90 mb-2">Belum Bayar</h3>
                                <p className="text-3xl font-bold">{allUnpaidPayments.length}</p>
                                <p className="text-xs opacity-75 mt-1">bulan total</p>
                            </div>

                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                                <h3 className="text-sm font-medium opacity-90 mb-2">Total Tunggakan</h3>
                                <p className="text-2xl font-bold">Rp {totalDebt.toLocaleString("id-ID")}</p>
                                <p className="text-xs opacity-75 mt-1">yang harus dibayar</p>
                            </div>
                        </div>

                        {/* Alert for unpaid */}
                        {unpaidPayments.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <FiAlertCircle className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-900">Perhatian!</h4>
                                        <p className="text-sm text-red-800 mt-1">
                                            Anda memiliki tunggakan <strong>{unpaidPayments.length} bulan</strong> sebesar{" "}
                                            <strong>Rp {totalDebt.toLocaleString("id-ID")}</strong>.
                                            Silakan hubungi bendahara untuk pembayaran.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment List */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                Riwayat Pembayaran Bulanan
                            </h2>

                            {payments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    Belum ada data kas. Hubungi bendahara.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {payments.sort((a, b) => b.bulan.localeCompare(a.bulan)).map((payment) => (
                                        <div
                                            key={payment.id}
                                            className={`p-4 rounded-lg border-2 ${payment.isPaid
                                                ? "border-green-500 bg-green-50"
                                                : "border-red-300 bg-red-50"
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {formatMonth(payment.bulan)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Rp {payment.jumlah.toLocaleString("id-ID")}
                                                    </p>
                                                    {payment.isPaid && payment.paidAt && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Dibayar: {new Date(payment.paidAt).toLocaleDateString("id-ID")}
                                                        </p>
                                                    )}
                                                </div>
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${payment.isPaid
                                                        ? "bg-green-600 text-white"
                                                        : "bg-red-500 text-white"
                                                        }`}
                                                >
                                                    {payment.isPaid ? (
                                                        <FiCheck className="text-2xl" />
                                                    ) : (
                                                        <FiX className="text-2xl" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informasi Kas</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Kas bulanan: <strong>Rp 10,000</strong> per bulan</li>
                                <li>• Pembayaran dikelola oleh bendahara</li>
                                <li>• Untuk pembayaran tunggakan, hubungi bendahara HIMSI</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
