"use client";

import Image from "next/image";
import { useAppSelector } from "@/hooks/redux";

export default function Page() {
    const { user: userData } = useAppSelector((state) => state);

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
                </div>
            </div>
        </div>
    );
}
