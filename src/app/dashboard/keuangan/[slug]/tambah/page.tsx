"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect } from "react";

// 1. Definisikan interface untuk data form transaksi
interface TransaksiFormData {
  judul: string;
  jumlah: number | string; // Bisa string saat user mengetik
  tanggal: string;
  tipe: "rutin" | "tidak";
  kebutuhan?: "internal" | "external"; // Opsional, hanya untuk pengeluaran
}

export default function Page() {
  // State untuk memilih antara form pemasukan atau pengeluaran
  const [formType, setFormType] = useState<"pemasukan" | "pengeluaran">(
    "pengeluaran"
  );

  // State untuk data form
  const [formData, setFormData] = useState<TransaksiFormData>({
    judul: "",
    jumlah: "",
    tanggal: "",
    tipe: "tidak",
    kebutuhan: "internal",
  });

  // State untuk error validasi
  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    jumlah: { status: false, message: "" },
    tanggal: { status: false, message: "" },
  });
  
  // State untuk menvalidasi apakah form siap di-submit
  const [isFormValid, setIsFormValid] = useState(false);

  // Fungsi validasi
  const validateField = (field: string, value: string | number) => {
    let error = { status: false, message: "" };

    switch (field) {
      case "judul":
        if (typeof value === "string" && !value.trim()) {
          error = { status: true, message: "Judul wajib diisi" };
        }
        break;
      case "jumlah":
        if (!value) {
          error = { status: true, message: "Jumlah wajib diisi" };
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = { status: true, message: "Jumlah harus angka positif" };
        }
        break;
      case "tanggal":
        if (!value) {
          error = { status: true, message: "Tanggal wajib diisi" };
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handler untuk perubahan input
  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Opsi untuk radio button
  const jenisTransaksiOptions = [
    { value: "pengeluaran", label: "Pengeluaran" },
    { value: "pemasukan", label: "Pemasukan" },
  ];

  const tipeOptions = [
    { value: "rutin", label: "Rutin" },
    { value: "tidak", label: "Tidak Rutin" },
  ];

  const kebutuhanOptions = [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
  ];

  // Efek untuk memeriksa validitas form setiap kali data atau error berubah
  useEffect(() => {
    const isErrorPresent = Object.values(errors).some(error => error.status);
    let isDataMissing = !formData.judul || !formData.jumlah || !formData.tanggal;

    if (formType === 'pengeluaran' && !formData.kebutuhan) {
        isDataMissing = true;
    }

    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors, formType]);


  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      {/* Left Section */}
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Catat Transaksi Keuangan
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Gunakan form ini untuk mencatat setiap transaksi pemasukan atau
          pengeluaran kas HIMSI. Pastikan data yang diinput sudah benar dan
          dapat dipertanggungjawabkan untuk menjaga transparansi keuangan.
        </span>
        <div className="w-full sm:w-3/4 mt-4">
          <Image
            src="/assets/undraw/printing-invoices.svg" // Ganti dengan ilustrasi yang relevan
            height={5000}
            width={5000}
            alt="finance illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section (Form) */}
      <form className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        {/* Pilihan Jenis Transaksi */}
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-sm font-medium text-gray-700">
            *Pilih Jenis Transaksi
          </label>
          <RadioButtonGroup
            className="grid grid-cols-2 gap-2"
            options={jenisTransaksiOptions}
            name="jenis_transaksi"
            value={formType}
            onChange={(value) =>
              setFormType(value as "pemasukan" | "pengeluaran")
            }
          />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          Form {formType}
        </h2>

        <div className="mt-8 flex flex-col gap-8">
          <InputText
            label="*Judul Transaksi"
            placeholder={`Contoh: Beli spanduk acara`}
            name="judul"
            type="text"
            onChange={(e) => handleChange("judul", e.target.value)}
            isError={errors.judul}
          />
          <InputText
            label="*Jumlah (Rp)"
            placeholder="Contoh: 50000"
            name="jumlah"
            type="number"
            onChange={(e) => handleChange("jumlah", e.target.value)}
            isError={errors.jumlah}
          />
          <InputDate
            onChange={(e) => handleChange("tanggal", e)}
            value={formData.tanggal}
            isError={errors.tanggal}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Tipe</label>
            <RadioButtonGroup
              className="grid grid-cols-2 gap-2"
              options={tipeOptions}
              name="tipe"
              value={formData.tipe}
              onChange={(value) => handleChange("tipe", String(value))}
            />
          </div>

          {/* Input Kebutuhan yang Muncul Kondisional */}
          {formType === "pengeluaran" && (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                *Kebutuhan
              </label>
              <RadioButtonGroup
                className="grid grid-cols-2 gap-2"
                options={kebutuhanOptions}
                name="kebutuhan"
                value={formData.kebutuhan ?? "internal"}
                onChange={(value) => handleChange("kebutuhan", String(value))}
              />
            </div>
          )}

          <div className="w-full flex justify-end pb-1 mt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
              className={`text-white ${
                !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer hover:bg-primary-dark"
              } rounded-lg px-4 py-2 font-semibold`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}