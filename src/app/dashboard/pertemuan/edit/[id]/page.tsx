"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 

interface PertemuanFormData {
  judul: string;
  lokasi: string;
  tanggal: string;
  status: "Upcoming" | "Passed";
}


const dummyData: { [key: string]: PertemuanFormData } = {
  "meet-001": {
    judul: "Rapat Bulanan BPH & Koordinator",
    lokasi: "Sekretariat HIMSI",
    tanggal: "2025-08-30", 
    status: "Upcoming",
  },
};

export default function EditPertemuanPage() {
  const params = useParams(); 
  const id = params.id as string;

  const [formData, setFormData] = useState<PertemuanFormData>({
    judul: "",
    lokasi: "",
    tanggal: "",
    status: "Upcoming",
  });
  
  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    lokasi: { status: false, message: "" },
    tanggal: { status: false, message: "" },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (id && dummyData[id]) {
      setFormData(dummyData[id]);
    }
  }, [id]);

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
        if (!value) error = { status: true, message: "Tanggal wajib diisi" };
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handler untuk perubahan input
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Opsi untuk radio button status
  const statusOptions = [
    { value: "Upcoming", label: "Upcoming" },
    { value: "Passed", label: "Passed" },
  ];

  // Efek untuk memeriksa validitas form
  useEffect(() => {
    const isErrorPresent = Object.values(errors).some(error => error.status);
    const isDataMissing = !formData.judul || !formData.lokasi || !formData.tanggal;
    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Di sini kamu akan memanggil API untuk mengirim data update
      alert("Data pertemuan berhasil diupdate!");
    }
  };

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      {/* Left Section */}
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Edit Jadwal Pertemuan
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Ubah detail pertemuan atau acara HIMSI. Pastikan semua informasi
          seperti judul, lokasi, dan tanggal sudah benar sebelum disimpan.
          Perubahan akan langsung terlihat oleh semua anggota.
        </span>
        <div className="w-full sm:w-3/4 mt-4">
          <Image
            src="/assets/undraw/business-chat.svg" 
            height={5000}
            width={5000}
            alt="events illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section (Form) */}
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Form Edit Pertemuan
        </h2>
        <div className="mt-8 flex flex-col gap-8">
          <InputText
            label="*Judul Pertemuan"
            placeholder="Masukkan judul pertemuan"
            name="judul"
            type="text"
            value={formData.judul}
            onChange={(e) => handleChange("judul", e.target.value)}
            isError={errors.judul}
          />
          <InputText
            label="*Lokasi"
            placeholder="Contoh: Sekretariat HIMSI"
            name="lokasi"
            type="text"
            value={formData.lokasi}
            onChange={(e) => handleChange("lokasi", e.target.value)}
            isError={errors.lokasi}
          />
          <InputDate
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
              Update Pertemuan
            </button>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}