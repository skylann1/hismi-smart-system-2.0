"use client";

import Image from "next/image";
import { useAppSelector } from "@/hooks/redux";
import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function Page() {
    const { user: userData } = useAppSelector((state) => state);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" };
        if (password.length < 8) return { strength: 1, label: "Lemah", color: "bg-red-500" };
        if (password.length < 12) return { strength: 2, label: "Sedang", color: "bg-yellow-500" };
        return { strength: 3, label: "Kuat", color: "bg-green-500" };
    };

    const handleChangePassword = async () => {
        setError("");
        setSuccess("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Semua field harus diisi");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Password baru dan konfirmasi tidak cocok");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await fetch("/dashboard/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const result = await response.json();

            if (result.success) {
                setSuccess("Password berhasil diubah!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError(result.message || "Gagal mengubah password");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="w-full relative px-6 md:px-12 py-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
                <p className="text-slate-500">Manage your account information</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                            <Image
                                src={userData.imageUrl || "/assets/static-img/female.svg"}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Personal Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                                        <p className="text-slate-900 font-medium">{userData.nama}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                                        <p className="text-slate-900 font-medium">{userData.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
                                        <p className="text-slate-900 font-medium">{userData.no_hp || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Tanggal lahir</label>
                                        <p className="text-slate-900 font-medium">{userData.tanggal_lahir || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Address</label>
                                        <p className="text-slate-900 font-medium">-</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Academic & Organization</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">NIM</label>
                                        <p className="text-slate-900 font-medium">{userData.nim || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Jenjang pendidikan</label>
                                        <p className="text-slate-900 font-medium">{userData.jenjang_pendidikan || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Semester & Tipe kelas</label>
                                        <p className="text-slate-900 font-medium">{userData.semester || "-"} & {userData.tipe_kelas || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Division & Role</label>
                                        <p className="text-slate-900 font-medium">{userData.divisi || "-"} & {userData.role || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Tahun masuk</label>
                                        <p className="text-slate-900 font-medium">{userData.tahun_masuk || "-"}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Status</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {userData.status || "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Keamanan Akun</h3>

                        <div className="bg-gray-50 rounded-lg p-6 max-w-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <FiLock className="text-slate-600" />
                                <h4 className="font-medium text-slate-800">Ubah Password</h4>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Old Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Password Lama
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            placeholder="Masukkan password lama"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showOldPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            placeholder="Minimal 8 karakter"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                    {newPassword && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 flex-1 rounded ${level <= passwordStrength.strength
                                                                ? passwordStrength.color
                                                                : "bg-gray-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-600">
                                                Kekuatan password: <span className="font-medium">{passwordStrength.label}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Konfirmasi Password Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            placeholder="Ketik ulang password baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword}
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                                >
                                    {isChangingPassword ? "Mengubah..." : "Ubah Password"}
                                </button>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-yellow-800">
                                    <p className="font-medium mb-1">💡 Lupa password?</p>
                                    <p>
                                        Hubungi admin (Role Settings) untuk reset password. Password akan direset ke tanggal lahir Anda (format: YYYYMMDD).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
