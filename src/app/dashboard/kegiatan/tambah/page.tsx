"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect } from "react";

// 1. Definisikan interface untuk data form kegiatan
interface KegiatanFormData {
  judul: string;
  lokasi: string;
  divisi: string;
  tanggal: string;
  status: "Akan Datang" | "Selesai";
}

export default function TambahKegiatanPage() {
  // State untuk data form kegiatan, dimulai dengan nilai kosong
  const [formData, setFormData] = useState<KegiatanFormData>({
    judul: "",
    lokasi: "",
    divisi: "pendidikan",
    tanggal: "",
    status: "Akan Datang",
  });
  
  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    lokasi: { status: false, message: "" },
    tanggal: { status: false, message: "" },
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
      case "tanggal":
        if (!value) error = { status: true, message: "Tanggal pelaksanaan wajib diisi" };
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
    { value: "Akan Datang", label: "Akan Datang" },
    { value: "Selesai", label: "Selesai" },
  ];

  useEffect(() => {
    const isErrorPresent = Object.values(errors).some(error => error.status);
    const isDataMissing = !formData.judul || !formData.lokasi || !formData.tanggal;
    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Data kegiatan baru yang akan dikirim:", formData);
      alert("Kegiatan baru berhasil ditambahkan!");
      // Reset form setelah submit
      setFormData({
        judul: "",
        lokasi: "",
        divisi: "pendidikan",
        tanggal: "",
        status: "Akan Datang",
      });
    }
  };

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      {/* Left Section */}
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Tambah Kegiatan Baru
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Buat jadwal kegiatan baru. Pastikan semua informasi seperti divisi
          penyelenggara, lokasi, dan tanggal pelaksanaan sudah benar.
        </span>
        <div className="w-full sm:w-3/4 mt-4 flex justify-center">
          <Image
            src="/assets/undraw/refreshing.svg"
            height={5000}
            width={5000}
            alt="tambah kegiatan illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section (Form) */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Form Tambah Kegiatan
        </h2>
        <div className="mt-8 flex flex-col gap-8">
          <InputText
            label="*Judul Kegiatan"
            placeholder="Masukkan judul kegiatan"
            name="judul"
            type="text"
            value={formData.judul}
            onChange={(e) => handleChange("judul", e.target.value)}
            isError={errors.judul}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Divisi Penyelenggara</label>
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
            label="*Tanggal Pelaksanaan"
            onChange={(e) => handleChange("tanggal", e)}
            value={formData.tanggal}
            isError={errors.tanggal}
            disableFutureDates={false}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Status</label>
            <RadioButtonGroup
              className="grid grid-cols-2 gap-2"
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
              Tambah Kegiatan
            </button>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}
