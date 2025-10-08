"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect } from "react";

interface ProkerFormData {
  judul: string;
  lokasi: string;
  divisi: string;
  tanggal_selesai: string;
  status: "Berjalan" | "Selesai" | "Direncanakan";
}

export default function TambahProkerPage() {
  const [formData, setFormData] = useState<ProkerFormData>({
    judul: "",
    lokasi: "",
    divisi: "pendidikan", // Nilai default
    tanggal_selesai: "",
    status: "Direncanakan", // Nilai default
  });
  
  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    lokasi: { status: false, message: "" },
    tanggal_selesai: { status: false, message: "" },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (field: string, value: string) => {
    let error = { status: false, message: "" };
    switch (field) {
      case "judul":
        if (!value.trim()) error = { status: true, message: "Judul wajib diisi" };
        break;
      case "lokasi":
        if (!value.trim()) error = { status: true, message: "Lokasi wajib diisi" };
        break;
      case "tanggal_selesai":
        if (!value) error = { status: true, message: "Tanggal target wajib diisi" };
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const divisiOptions = [
      { value: "pendidikan", label: "Pendidikan" },
      { value: "kominfo", label: "Kominfo" },
      { value: "litbang", label: "Litbang" },
      { value: "rsdm", label: "RSDM" },
      { value: "bph", label: "BPH" },
  ];

  const statusOptions = [
    { value: "Direncanakan", label: "Direncanakan" },
    { value: "Berjalan", label: "Berjalan" },
    { value: "Selesai", label: "Selesai" },
  ];

  useEffect(() => {
    const isErrorPresent = Object.values(errors).some(error => error.status);
    const isDataMissing = !formData.judul || !formData.lokasi || !formData.tanggal_selesai;
    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Data proker baru yang akan dikirim:", formData);
      alert("Program kerja baru berhasil ditambahkan!");
      setFormData({
        judul: "",
        lokasi: "",
        divisi: "pendidikan",
        tanggal_selesai: "",
        status: "Direncanakan",
      });
    }
  };

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      {/* Left Section */}
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Tambah Program Kerja Baru
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Buat program kerja baru untuk periode ini. Pastikan semua detail
          seperti divisi penanggung jawab, lokasi, dan target tanggal sudah
          benar.
        </span>
        <div className="w-full sm:w-3/4 mt-4 flex justify-center">
          <Image
            src="/assets/undraw/live-collaboration.svg" // Ilustrasi baru
            height={5000}
            width={5000}
            alt="add proker illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section (Form) */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Form Tambah Proker
        </h2>
        <div className="mt-8 flex flex-col gap-8">
          <InputText
            label="*Judul Program Kerja"
            placeholder="Masukkan judul proker"
            name="judul"
            type="text"
            value={formData.judul}
            onChange={(e) => handleChange("judul", e.target.value)}
            isError={errors.judul}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Divisi Penanggung Jawab</label>
            <RadioButtonGroup
              className="grid grid-cols-3 gap-2"
              options={divisiOptions}
              name="divisi"
              value={formData.divisi}
              onChange={(value) => handleChange("divisi", String(value))}
            />
          </div>
          <InputText
            label="*Lokasi"
            placeholder="Contoh: Aula Kampus / Online"
            name="lokasi"
            type="text"
            value={formData.lokasi}
            onChange={(e) => handleChange("lokasi", e.target.value)}
            isError={errors.lokasi}
          />
          <InputDate
            label="*Target Tanggal Selesai"
            onChange={(e) => handleChange("tanggal_selesai", e)}
            value={formData.tanggal_selesai}
            isError={errors.tanggal_selesai}
            disableFutureDates={false}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Status</label>
            <RadioButtonGroup
              className="grid grid-cols-3 gap-2"
              options={statusOptions}
              name="status"
              value={formData.status}
              onChange={(value) => handleChange("status", String(value))}
            />
          </div>
          <div className="w-full flex justify-end pb-1 mt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
              className={`text-white ${
                !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer hover:bg-primary-dark"
              } rounded-lg px-4 py-2 font-semibold transition-colors`}
            >
              Tambah Proker
            </button>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}
