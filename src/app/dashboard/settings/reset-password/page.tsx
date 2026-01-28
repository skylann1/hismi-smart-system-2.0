"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { hasAccess, ROLES } from "@/lib/roles";
import { FiSearch, FiRefreshCw, FiCopy, FiCheck } from "react-icons/fi";

interface User {
    id: string;
    nama: string;
    nim: string;
    email: string;
    tanggal_lahir: string;
}

export default function ResetPasswordPage() {
    const { user } = useAppSelector((state) => state);
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [copied, setCopied] = useState(false);

    const isAdmin = user.id && hasAccess(user.access, ROLES.ADMIN);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/dashboard/api/anggota");
            const result = await response.json();
            if (result.success) {
                setUsers(result.data || []);
                setFilteredUsers(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = users.filter(u =>
                u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.nim.includes(searchTerm) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const handleResetPassword = async () => {
        if (!selectedUser) return;

        setIsResetting(true);

        try {
            const response = await fetch("/dashboard/api/user/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.id }),
            });

            const result = await response.json();

            if (result.success) {
                setNewPassword(result.data.newPassword);
                alert(`Password berhasil direset!\n\nUser: ${result.data.userName}\nPassword Baru: ${result.data.newPassword}\n\nSalin dan berikan ke user.`);
            } else {
                alert(result.message || "Gagal reset password");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan");
        } finally {
            setIsResetting(false);
        }
    };

    const copyPassword = () => {
        navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Access check after all hooks
    if (!isAdmin) {
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

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Reset Password User
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Reset password user ke tanggal lahir (YYYYMMDD)
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User List */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800 mb-3">Pilih User</h3>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari nama, NIM, atau email..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="w-8 h-8 border-t-2 border-blue-600 rounded-full animate-spin"></div>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => setSelectedUser(u)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedUser?.id === u.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900">{u.nama}</p>
                                        <p className="text-xs text-gray-600">{u.nim} • {u.email}</p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    {searchTerm ? "User tidak ditemukan" : "Tidak ada user"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Reset Panel */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Reset Password</h3>

                        {selectedUser ? (
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">User Dipilih:</p>
                                    <p className="font-semibold text-gray-900">{selectedUser.nama}</p>
                                    <p className="text-sm text-gray-600">{selectedUser.nim}</p>
                                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                    {selectedUser.tanggal_lahir && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Tanggal Lahir: {selectedUser.tanggal_lahir}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-yellow-900 mb-2">⚠️ Peringatan</p>
                                    <ul className="text-xs text-yellow-800 space-y-1">
                                        <li>• Password akan direset ke tanggal lahir (YYYYMMDD)</li>
                                        <li>• User lama tidak akan bisa login dengan password lama</li>
                                        <li>• Salin password baru dan berikan ke user</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    disabled={isResetting}
                                    className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                                >
                                    <FiRefreshCw className={isResetting ? "animate-spin" : ""} />
                                    {isResetting ? "Mereset..." : "Reset Password"}
                                </button>

                                {newPassword && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-green-900 mb-2">✅ Password Berhasil Direset!</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newPassword}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md font-mono text-sm"
                                            />
                                            <button
                                                onClick={copyPassword}
                                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                {copied ? <FiCheck /> : <FiCopy />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-green-800 mt-2">
                                            {copied ? "Password disalin!" : "Klik untuk salin password"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <FiRefreshCw className="mx-auto text-4xl mb-3 opacity-30" />
                                <p>Pilih user untuk reset password</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informasi</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Password default adalah tanggal lahir user (format: YYYYMMDD)</li>
                        <li>• Contoh: User lahir 15 Januari 2000 → Password: 20000115</li>
                        <li>• User dapat mengubah password mereka di halaman Profile</li>
                        <li>• Admin bertanggung jawab menyampaikan password baru ke user</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
