"use client";

import { bungee, inter } from "@/app/fonts";
import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface FormDataType {
  email: string;
  password: string;
}

interface ErrorType {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- VALIDASI PER FIELD ---
  const validateField = (
    field: keyof FormDataType,
    value: string
  ): string | undefined => {
    if (field === "email") {
      if (!value.trim()) return "Email tidak boleh kosong.";
      if (value.length < 8) return "Email minimal 8 karakter.";
      if (!/\S+@\S+\.\S+/.test(value)) return "Format email tidak valid.";
    }

    if (field === "password") {
      if (!value.trim()) return "Password tidak boleh kosong.";
      if (value.length < 8) return "Password minimal 8 karakter.";
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

    // Validasi semua field
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
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        if (res.error.includes("Email")) {
          setErrors({ email: res.error });
        } else if (res.error.includes("Password")) {
          setErrors({ password: res.error });
        } else {
          setErrors({ general: res.error });
        }
        return;
      }

      if (res?.ok) {
        router.push(res.url ?? "/dashboard");
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
              HIMSI <span className="text-primary">KLA</span>
            </div>
            <p className="font-regular opacity-70 text-xs text-center">
              Pastikan anda sudah terdaftar dalam sistem dengan memastikannya ke
              divisi pendidikan.
            </p>
          </div>
          <div className="sm:w-[500px] md:w-full overflow-hidden">
            <Image
              src="/assets/static-img/showing-support.svg"
              alt="Support Illustration"
              className="w-full object-center object-cover"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>

        <div className="w-36 flex md:hidden absolute -top-24 z-20">
          <Image
            src="/assets/static-img/boy-sitting.png"
            alt="Boy Sitting"
            className="w-full object-center object-cover"
            width={144}
            height={144}
          />
        </div>
        <div className="w-72 h-72 bg-primary rounded-xl absolute -top-[1rem] md:hidden opacity-80 shadow-md"></div>
        <div className="w-72 h-72 bg-primary rounded-xl absolute -top-[2rem] md:hidden opacity-75 shadow-md"></div>
        <div className="w-72 h-72 bg-primary rounded-xl absolute -top-[3rem] md:hidden opacity-55 shadow-md"></div>
        <div className="w-72 h-72 bg-primary rounded-xl absolute -top-[4rem] md:hidden opacity-35 shadow-md"></div>
        <div className="w-72 h-72 bg-primary rounded-xl absolute -top-[5rem] md:hidden opacity-15 shadow-md"></div>

        {/* Bagian Kanan (Form Login) */}
        <div className="w-full h-[450px] md:w-1/2 md:bg-gray-50 shadow-xl p-6 md:p-8 flex flex-col justify-center items-center gap-10 md:gap-4 z-10 bg-white rounded-xl md:rounded-none relative">
          <div className="flex flex-col w-full">
            <h1
              className={`font-bold text-gray-800 text-3xl text-center md:text-start ${bungee.className}`}
            >
              Welcome Back!
            </h1>
            <p className="font-normal text-sm text-center md:text-start text-gray-600">
              Masuk untuk melanjutkan ke dashboard panel kamu.
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

            {/* Input Email */}
            <label
              htmlFor="email"
              className={`block mb-1 text-sm font-medium ${
                errors.email ? "text-red-500" : "text-gray-800"
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
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukan Email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 mb-2">{errors.email}</p>
            )}

            {/* Input Password */}
            <label
              htmlFor="password"
              className={`block mb-1 text-sm font-medium mt-4 ${
                errors.password ? "text-red-500" : "text-gray-800"
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
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="********"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 mb-2">
                {errors.password}
              </p>
            )}

            {/* Tombol Login */}
            <button
              className={`w-full mt-6 bg-primary text-white py-2 font-semibold text-sm rounded-md 
    ${
      isLoading || Object.keys(errors).length > 0
        ? "opacity-50 cursor-not-allowed"
        : "opacity-100"
    }
  `}
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? "Processing..." : "LOGIN"}
            </button>

            <div className="w-full justify-center items-center text-center font-medium text-sm mt-2 opacity-90">
              Dont have an account?{" "}
              <Link
                href="/register"
                className="text-sky-800 underline underline-offset-1"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
