"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiLoader, FiCheckCircle } from "react-icons/fi";

export default function InitializeKasPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    const [startMonth, setStartMonth] = useState("2026-01");
    const [endMonth, setEndMonth] = useState("2026-12");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Check admin access
    if (!user.id || !hasAccess(user.access, ROLES.ADMIN)) {
        return (
            <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="font-bold text-red-900 mb-2">⚠️ Akses Ditolak</h3>
                    <p className="text-sm text-red-800">
                        Hanya admin yang dapat mengakses halaman ini.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleInitialize = async () => {
        if (!confirm("Yakin ingin initialize kas untuk semua anggota? Ini akan membuat data kas untuk bulan yang ditentukan.")) {
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("/dashboard/api/keuangan/kas/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startMonth, endMonth }),
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                alert("Inisialisasi berhasil! Data kas telah dibuat.");
            } else {
                alert(data.message || "Gagal initialize");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Initialize Kas Anggota
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Generate data kas untuk semua anggota (Admin Only)
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bulan Mulai (YYYY-MM)
                            </label>
                            <input
                                type="month"
                                value={startMonth}
                                onChange={(e) => setStartMonth(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bulan Selesai (YYYY-MM)
                            </label>
                            <input
                                type="month"
                                value={endMonth}
                                onChange={(e) => setEndMonth(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <button
                            onClick={handleInitialize}
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    Sedang Proses...
                                </>
                            ) : (
                                "Initialize Kas"
                            )}
                        </button>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-lg ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                            <div className="flex items-start gap-2">
                                {result.success && <FiCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />}
                                <div>
                                    <h3 className={`font-medium ${result.success ? "text-green-900" : "text-red-900"}`}>
                                        {result.message}
                                    </h3>
                                    {result.data && (
                                        <div className="text-sm mt-2 space-y-1">
                                            <p>Total Users: {result.data.totalUsers}</p>
                                            <p>Berhasil: {result.data.successCount}</p>
                                            {result.data.skipCount > 0 && <p>Dilewati: {result.data.skipCount}</p>}
                                            {result.data.errorCount > 0 && <p>Gagal: {result.data.errorCount}</p>}
                                            <p>Bulan yang dibuat: {result.data.monthsRequested}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Peringatan</h4>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Script ini akan membuat record kas untuk SEMUA user yang terdaftar</li>
                            <li>• Semua pembayaran akan dimulai dengan status "belum bayar"</li>
                            <li>• Jika bulan sudah ada, akan dilewati (tidak duplicate)</li>
                            <li>• Bendahara bisa edit status pembayaran di halaman Kas Anggota</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
