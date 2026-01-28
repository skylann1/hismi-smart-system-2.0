"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter, useParams } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiCheck, FiX, FiSave } from "react-icons/fi";

interface MemberPayment {
    id: string;
    bulan: string; // "2025-01"
    jumlah: number;
    isPaid: boolean;
    paidAt?: Date;
}

interface MemberData {
    userId: string;
    nama: string;
    nim: string;
    divisi: string;
    payments: MemberPayment[];
}

export default function EditKasAnggotaPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [memberData, setMemberData] = useState<MemberData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [changes, setChanges] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!user.id || !hasAccess(user.access, ROLES.BENDAHARA)) {
            router.push("/dashboard");
            return;
        }
        fetchMemberData();
    }, [user, router, userId]);

    const fetchMemberData = async () => {
        try {
            const response = await fetch(`/dashboard/api/keuangan/kas/anggota/${userId}`);
            const result = await response.json();
            if (result.success) {
                setMemberData(result.data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePayment = (paymentId: string, currentStatus: boolean) => {
        setChanges((prev) => ({
            ...prev,
            [paymentId]: !currentStatus,
        }));
    };

    const saveChanges = async () => {
        if (Object.keys(changes).length === 0) {
            alert("Tidak ada perubahan");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(`/dashboard/api/keuangan/kas/anggota/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    changes,
                    updatedBy: user.id
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Perubahan berhasil disimpan!");
                setChanges({});
                fetchMemberData();
            } else {
                alert(result.message || "Gagal menyimpan");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSaving(false);
        }
    };

    const getDisplayStatus = (payment: MemberPayment) => {
        if (changes.hasOwnProperty(payment.id!)) {
            return changes[payment.id!];
        }
        return payment.isPaid;
    };

    const formatMonth = (bulan: string) => {
        const [year, month] = bulan.split("-");
        const months = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        return `${months[parseInt(month)]} ${year}`;
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!memberData) {
        return (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Data tidak ditemukan</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const totalPaid = memberData.payments.filter((p) => getDisplayStatus(p)).length;
    const totalUnpaid = memberData.payments.length - totalPaid;
    const debt = totalUnpaid * 10000;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{memberData.nama}</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {memberData.nim} • {memberData.divisi}
                            </p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                        >
                            Kembali
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                            <p className="text-xs text-gray-600">Sudah Bayar</p>
                            <p className="text-xl font-bold text-green-600">{totalPaid} bulan</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Belum Bayar</p>
                            <p className="text-xl font-bold text-orange-600">{totalUnpaid} bulan</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Tunggakan</p>
                            <p className="text-xl font-bold text-red-600">
                                Rp {debt.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                {Object.keys(changes).length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-yellow-800">
                                Ada {Object.keys(changes).length} perubahan yang belum disimpan
                            </p>
                            <button
                                onClick={saveChanges}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 text-sm"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <FiSave />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Riwayat Pembayaran Bulanan
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {memberData.payments.sort((a, b) => b.bulan.localeCompare(a.bulan)).map((payment) => {
                            const currentStatus = getDisplayStatus(payment);
                            const hasChange = changes.hasOwnProperty(payment.id!);

                            return (
                                <button
                                    key={payment.id}
                                    onClick={() => togglePayment(payment.id!, payment.isPaid)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${currentStatus
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-white hover:border-gray-400"
                                        } ${hasChange ? "ring-2 ring-yellow-400" : ""}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">{formatMonth(payment.bulan)}</p>
                                            <p className="text-sm text-gray-600">
                                                Rp {payment.jumlah.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasChange && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                    Berubah
                                                </span>
                                            )}
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStatus
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                {currentStatus ? <FiCheck /> : <FiX />}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
