"use client";

import { bungee, inter } from "@/app/fonts";
import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail, MdPerson } from "react-icons/md";
import Image from "next/image";

interface FormDataType {
    nama: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ErrorType {
    nama?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function GuestRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormDataType>({
        nama: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<ErrorType>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateField = (
        field: keyof FormDataType,
        value: string
    ): string | undefined => {
        if (field === "nama") {
            if (!value.trim()) return "Nama tidak boleh kosong.";
        }
        if (field === "email") {
            if (!value.trim()) return "Email tidak boleh kosong.";
            if (value.length < 8) return "Email minimal 8 karakter.";
            if (!/\S+@\S+\.\S+/.test(value)) return "Format email tidak valid.";
        }
        if (field === "password") {
            if (!value.trim()) return "Password tidak boleh kosong.";
            if (value.length < 8) return "Password minimal 8 karakter.";
        }
        if (field === "confirmPassword") {
            if (value !== formData.password) return "Password tidak sama.";
        }

        return undefined;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        const errorMsg = validateField(name as keyof FormDataType, value);

        setErrors((prev) => {
            const newErrors = { ...prev };
            if (errorMsg) {
                newErrors[name as keyof ErrorType] = errorMsg;
            } else {
                delete newErrors[name as keyof ErrorType];
            }
            return newErrors;
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const newErrors: ErrorType = {};
        (Object.keys(formData) as (keyof FormDataType)[]).forEach((field) => {
            const errorMsg = validateField(field, formData[field]);
            if (errorMsg) newErrors[field] = errorMsg;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register/guest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: formData.nama,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/member/login");
            } else {
                setErrors({ general: data.message || "Registrasi gagal." });
            }
        } catch {
            setErrors({ general: "Tidak dapat terhubung ke server." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center md:p-0 p-6">
            <div className="flex w-full md:w-2/3 bg-white h-5/6 gap-6 justify-center items-center mx-auto border border-gray-300 rounded-xl md:rounded-md flex-col md:flex-row relative mt-20 md:mt-0 md:overflow-hidden">

                {/* Bagian Kiri */}
                <div className="w-1/2 hidden md:flex flex-col justify-center items-center gap-6 p-1 md:p-12 relative">
                    <div className="flex flex-col justify-center items-center">
                        <div
                            className={`text-slate-900 font-extrabold md:text-4xl text-center tracking-wide ${inter.className}`}
                        >
                            HIMSI <span className="text-primary">GUEST</span>
                        </div>
                        <p className="font-regular opacity-70 text-xs text-center">
                            Registrasi akun tamu untuk akses Pemilu HIMSI.
                        </p>
                    </div>
                    <div className="sm:w-[500px] md:w-full overflow-hidden">
                        {/* Reusing existing image or using a generic one */}
                        <Image
                            src="/assets/static-img/showing-support.svg"
                            alt="Guest Illustration"
                            className="w-full object-center object-cover"
                            width={500}
                            height={500}
                            priority
                        />
                    </div>
                </div>

                {/* Bagian Kanan (Form) */}
                <div className="w-full h-auto md:w-1/2 md:bg-gray-50 shadow-xl p-6 md:p-8 flex flex-col justify-center items-center gap-10 md:gap-4 z-10 bg-white rounded-xl md:rounded-none relative">
                    <div className="flex flex-col w-full">
                        <h1
                            className={`font-bold text-gray-800 text-3xl text-center md:text-start ${bungee.className}`}
                        >
                            Guest Register
                        </h1>
                        <p className="font-normal text-sm text-center md:text-start text-gray-600">
                            Buat akun tamu untuk berpartisipasi.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-center w-full h-full"
                    >
                        {errors.general && (
                            <p className="text-red-500 text-sm mb-4 text-center">
                                {errors.general}
                            </p>
                        )}

                        {/* Nama */}
                        <label
                            htmlFor="nama"
                            className={`block mb-1 text-sm font-medium ${errors.nama ? "text-red-500" : "text-gray-800"
                                }`}
                        >
                            Nama Lengkap
                        </label>
                        <div className="relative mb-2 w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none w-full">
                                <MdPerson className="text-base opacity-80" />
                            </div>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleInputChange}
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ${errors.nama ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Nama Lengkap"
                            />
                        </div>
                        {errors.nama && (
                            <p className="text-red-500 text-xs mt-1 mb-2">{errors.nama}</p>
                        )}

                        {/* Email */}
                        <label
                            htmlFor="email"
                            className={`block mb-1 text-sm font-medium ${errors.email ? "text-red-500" : "text-gray-800"
                                }`}
                        >
                            Email
                        </label>
                        <div className="relative mb-2 w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none w-full">
                                <MdEmail className="text-base opacity-80" />
                            </div>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ${errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 mb-2">{errors.email}</p>
                        )}

                        {/* Password */}
                        <label
                            htmlFor="password"
                            className={`block mb-1 text-sm font-medium mt-2 ${errors.password ? "text-red-500" : "text-gray-800"
                                }`}
                        >
                            Password
                        </label>
                        <div className="relative mb-2 w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none w-full">
                                <RiLockPasswordFill className="text-base opacity-80" />
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ${errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="********"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 mb-2">
                                {errors.password}
                            </p>
                        )}

                        {/* Confirm Password */}
                        <label
                            htmlFor="confirmPassword"
                            className={`block mb-1 text-sm font-medium mt-2 ${errors.confirmPassword ? "text-red-500" : "text-gray-800"
                                }`}
                        >
                            Konfirmasi Password
                        </label>
                        <div className="relative mb-2 w-full">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none w-full">
                                <RiLockPasswordFill className="text-base opacity-80" />
                            </div>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="********"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 mb-2">
                                {errors.confirmPassword}
                            </p>
                        )}

                        <button
                            className={`w-full mt-6 bg-primary text-white py-2 font-semibold text-sm rounded-md 
                ${isLoading || Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"}
              `}
                            type="submit"
                            disabled={isLoading || Object.keys(errors).length > 0}
                        >
                            {isLoading ? "Processing..." : "REGISTER"}
                        </button>

                        <div className="w-full justify-center items-center text-center font-medium text-sm mt-2 opacity-90">
                            Already have an account?{" "}
                            <Link
                                href="/member/login"
                                className="text-sky-800 underline underline-offset-1"
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
