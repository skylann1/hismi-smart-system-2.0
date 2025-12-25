"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect } from "react";
import InputTextArea from "@/components/ui/moleculs/input/InputArea";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import InputTime from "@/components/ui/moleculs/input/InputTime";

interface ProkerFormData {
  judul: string;
  lokasi: string;
  divisi: string;
  tanggal: string;
  status: "Upcoming" | "Passed" | "Ongoing";
  penanggung_jawab: string;
  deskripsi: string;
  maps: string;
  blogs: string;
  jamMulai: string;
  jamSelesai: string;
}

export default function TambahProkerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const url = `/dashboard/api/proker/tambah`;
  const [formData, setFormData] = useState<ProkerFormData>({
    judul: "",
    lokasi: "",
    divisi: "pendidikan", // Nilai default
    tanggal: "",
    status: "Ongoing", // Nilai default
    penanggung_jawab: "",
    deskripsi: "",
    maps: "",
    blogs: "",
    jamMulai: "",
    jamSelesai: "",
  });

  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    lokasi: { status: false, message: "" },
    tanggal: { status: false, message: "" },
    penanggung_jawab: { status: false, message: "" },
    deskripsi: { status: false, message: "" },
    maps: { status: false, message: "" },
    blogs: { status: false, message: "" },
    jamMulai: { status: false, message: "" },
    jamSelesai: { status: false, message: "" },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (field: string, value: string) => {
    let error = { status: false, message: "" };

    const isEmpty = (val: string) => !val.trim();

    switch (field) {
      case "judul":
        if (isEmpty(value)) {
          error = { status: true, message: "Judul wajib diisi" };
        } else if (value.trim().length < 5) {
          error = { status: true, message: "Judul minimal 5 karakter" };
        }
        break;

      case "lokasi":
        if (isEmpty(value)) {
          error = { status: true, message: "Lokasi wajib diisi" };
        } else if (value.length < 3) {
          error = { status: true, message: "Nama lokasi terlalu pendek" };
        }
        break;

      case "tanggal":
        if (!value) {
          error = { status: true, message: "Tanggal target wajib diisi" };
        } else {
          const inputDate = new Date(value);
          // const now = new Date();
          if (isNaN(inputDate.getTime())) {
            error = { status: true, message: "Format tanggal tidak valid" };
          }
        }
        break;

      case "penanggung_jawab":
        if (isEmpty(value)) {
          error = { status: true, message: "Penanggung jawab wajib diisi" };
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = { status: true, message: "Nama hanya boleh huruf dan spasi" };
        }
        break;

      case "deskripsi":
        if (isEmpty(value)) {
          error = { status: true, message: "Deskripsi wajib diisi" };
        } else if (value.length < 20) {
          error = { status: true, message: "Deskripsi minimal 20 karakter" };
        }
        break;
      case "jamMulai":
        if (!value) error = { status: true, message: "Jam mulai wajib diisi" };
        break;
      case "jamSelesai":
        if (!value) {
          error = { status: true, message: "Jam selesai wajib diisi" };
        } else if (formData.jamMulai && value <= formData.jamMulai) {
          error = {
            status: true,
            message: "Jam selesai harus lebih dari jam mulai",
          };
        }
        break;
      case "maps":
        if (!value.trim()) {
          error = { status: true, message: "Link maps wajib diisi" };
        } else if (
          !value.includes("google.com/maps") &&
          !value.includes("goo.gl/maps") &&
          !value.includes("maps.app.goo.gl")
        ) {
          error = {
            status: true,
            message: "Link maps harus berasal dari Google Maps",
          };
        }
        break;

      case "blogs":
        if (isEmpty(value)) {
          error = { status: true, message: "Blogs wajib diisi" };
        } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value)) {
          error = { status: true, message: "URL blog tidak valid" };
        }
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
    { value: "Upcoming", label: "Upcoming" },
    { value: "Passed", label: "Passed" },
    { value: "Ongoing", label: "Ongoing" },
  ];

  useEffect(() => {
    const isErrorPresent = Object.values(errors).some((error) => error.status);
    const isDataMissing =
      !formData.judul || !formData.lokasi || !formData.tanggal;
    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const submitProker = async () => {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const result = await response.json();
          if (!response.ok) {
            dispatch(
              alertIsAktif({
                status: false,
                title: "Error! Gagal menyimpan data ke sistem.",
                message: result.message,
              })
            );
            console.error("Error response dari server:", result);
            throw new Error(result.message || "Network response was not ok");
          }
          dispatch(
            alertIsAktif({
              status: true,
              title: "Sukses! Proker berhasil ditambahkan.",
              message: "Data proker baru telah tersimpan di sistem.",
            })
          );
          router.push("/dashboard/proker");
        } catch (error) {
          console.error("Error saat mengirim data proker:", error);
        }
      };
      submitProker();
      setFormData({
        judul: "",
        lokasi: "",
        divisi: "pendidikan",
        tanggal: "",
        status: "Ongoing",
        penanggung_jawab: "",
        deskripsi: "",
        maps: "",
        blogs: "",
        jamMulai: "",
        jamSelesai: "",
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
            src="/assets/undraw/live-collaboration.svg"
            height={5000}
            width={5000}
            alt="add proker illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section (Form) */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg"
      >
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

          <InputTextArea
            label="*Deskripsi"
            placeholder="Masukkan deskripsi proker"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={(e) => handleChange("deskripsi", e.target.value)}
            isError={errors.deskripsi}
          />

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
              *Divisi Penanggung Jawab
            </label>
            <RadioButtonGroup
              className="grid grid-cols-3 gap-2"
              options={divisiOptions}
              name="divisi"
              value={formData.divisi}
              onChange={(value) => handleChange("divisi", String(value))}
            />
          </div>
          <InputText
            label="*Penanggung jawab"
            placeholder="Contoh: Naufal lutfhi abdurrahim"
            name="penanggung_jawab"
            type="text"
            value={formData.penanggung_jawab}
            onChange={(e) => handleChange("penanggung_jawab", e.target.value)}
            isError={errors.penanggung_jawab}
          />
          <InputText
            label="*Lokasi"
            placeholder="Contoh: Aula Kampus / Online"
            name="lokasi"
            type="text"
            value={formData.lokasi}
            onChange={(e) => handleChange("lokasi", e.target.value)}
            isError={errors.lokasi}
          />
          <InputText
            label="*Maps (Link Google Maps)"
            placeholder="Contoh: https://maps.google.com/...."
            name="maps"
            type="text"
            value={formData.maps}
            onChange={(e) => handleChange("maps", e.target.value)}
            isError={errors.maps}
          />
          <InputText
            label="*Blog (Link Blog terkait) Opsional"
            placeholder="Contoh: https://himsikalibang.com/...."
            name="blogs"
            type="text"
            value={formData.blogs}
            onChange={(e) => handleChange("blogs", e.target.value)}
            isError={errors.blogs}
          />

          <InputDate
            label="*Target Tanggal"
            onChange={(e) => handleChange("tanggal", e)}
            value={formData.tanggal}
            isError={errors.tanggal}
            disableFutureDates={false}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputTime
              label="Jam Mulai"
              name="jamMulai"
              value={formData.jamMulai}
              onChange={handleChange}
              error={errors.jamMulai}
              required
            />
            <InputTime
              label="Jam Selesai"
              name="jamSelesai"
              value={formData.jamSelesai}
              onChange={handleChange}
              error={errors.jamSelesai}
              required
            />
          </div>
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
