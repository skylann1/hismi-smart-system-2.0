"use client";

import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import Link from "next/link";
import { FiSettings, FiUsers, FiDollarSign } from "react-icons/fi";

export default function SettingsPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    // Check admin access
    if (!user.id || !hasAccess(user.access, ROLES.ADMIN)) {
        return (
            <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="font-bold text-red-900 mb-2">⚠️ Akses Ditolak</h3>
                    <p className="text-sm text-red-800">
                        Hanya admin yang dapat mengakses halaman Settings.
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

    const settingsMenus = [
        {
            title: "Initialize Kas Anggota",
            description: "Generate data kas untuk semua anggota terdaftar",
            icon: <FiDollarSign className="text-2xl" />,
            href: "/dashboard/settings/initialize-kas",
            color: "blue",
        },
        {
            title: "Reset Password User",
            description: "Reset password user yang lupa ke tanggal lahir",
            icon: <FiSettings className="text-2xl" />,
            href: "/dashboard/settings/reset-password",
            color: "red",
        },
        {
            title: "Pemilu",
            description: "Konfigurasi pemilihan umum organisasi",
            icon: <FiUsers className="text-2xl" />,
            href: "/dashboard/settings/pemilu",
            color: "green",
        },
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FiSettings className="text-3xl text-primary" />
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Settings
                        </h1>
                    </div>
                    <p className="text-sm text-gray-600">
                        Pengaturan sistem dan konfigurasi aplikasi (Admin Only)
                    </p>
                </div>

                {/* Settings Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {settingsMenus.map((menu, index) => (
                        <Link key={index} href={menu.href}>
                            <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-${menu.color}-500`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 bg-${menu.color}-100 rounded-lg flex items-center justify-center text-${menu.color}-600 flex-shrink-0`}>
                                        {menu.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                                            {menu.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {menu.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">⚠️ Peringatan</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Halaman ini hanya dapat diakses oleh Admin (Role 10)</li>
                        <li>• Perubahan di settings dapat mempengaruhi seluruh sistem</li>
                        <li>• Pastikan Anda memahami setiap konfigurasi sebelum mengubahnya</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
