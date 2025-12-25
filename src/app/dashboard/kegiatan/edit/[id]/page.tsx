"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect, use } from "react";
import InputTextArea from "@/components/ui/moleculs/input/InputArea";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import InputTime from "@/components/ui/moleculs/input/InputTime";

interface KegiatanFormData {
  judul: string;
  lokasi: string;
  divisi: string;
  tanggal: string;
  maps: string;
  status: "Upcoming" | "Passed" | "Ongoing";
  deskripsi: string;
  jamMulai: string;
  jamSelesai: string;
}

export default function EditKegiatanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<KegiatanFormData>({
    judul: "",
    lokasi: "",
    divisi: "pendidikan",
    tanggal: "",
    status: "Ongoing",
    maps: "",
    deskripsi: "",
    jamMulai: "",
    jamSelesai: "",
  });

  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    lokasi: { status: false, message: "" },
    tanggal: { status: false, message: "" },
    maps: { status: false, message: "" },
    deskripsi: { status: false, message: "" },
    jamMulai: { status: false, message: "" },
    jamSelesai: { status: false, message: "" },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validateField = (field: string, value: string) => {
    let error = { status: false, message: "" };
    switch (field) {
      case "judul":
        if (!value.trim())
          error = { status: true, message: "Judul wajib diisi" };
        break;
      case "lokasi":
        if (!value.trim())
          error = { status: true, message: "Lokasi wajib diisi" };
        break;
      case "tanggal":
        if (!value)
          error = { status: true, message: "Tanggal pelaksanaan wajib diisi" };
        break;
      case "maps":
        if (value.trim()) {
          try {
            new URL(value);
          } catch {
            error = { status: true, message: "Link tidak valid" };
          }
        }
        break;
      case "deskripsi":
        if (!value.trim())
          error = { status: true, message: "Deskripsi wajib diisi" };
        if (value.length > 500)
          error = {
            status: true,
            message: "Deskripsi tidak boleh lebih dari 500 karakter",
          };
        if (value.length < 50)
          error = {
            status: true,
            message: "Deskripsi minimal 50 karakter",
          };
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
    try {
      if (isFormValid) {
        const submitData = async () => {
          const response = await fetch(`/dashboard/api/kegiatan/edit`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, id }),
          });

          const data = await response.json();

          if (!response.ok) {
            dispatch(
              alertIsAktif({
                status: false,
                title: "Error! Gagal menyimpan perubahan data ke sistem.",
                message: data.message,
              })
            );
            throw new Error("Network response was not ok");
          }
          dispatch(
            alertIsAktif({
              status: true,
              title: "Success! Yes berhasil nih update data ke system.",
              message: data.message,
            })
          );
          router.push("/dashboard/kegiatan");
        };

        submitData();
      } else {
        alert("Masih ada data yang belum valid bro 🚫");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setFormData({
        judul: "",
        lokasi: "",
        divisi: "pendidikan",
        tanggal: "",
        status: "Ongoing",
        maps: "",
        deskripsi: "",
        jamMulai: "",
        jamSelesai: "",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/dashboard/api/kegiatan?id=${id}`,
          { cache: "no-store", method: "GET" }
        );
        const json = await response.json();
        const data = json.data;

        if (!response.ok) throw new Error("Failed to fetch data");

        setFormData({
          judul: data.judul || "",
          lokasi: data.lokasi || "",
          maps: data.maps || "",
          tanggal: data.tanggal || "",
          status: data.status || "Direncanakan",
          deskripsi: data.deskripsi || "",
          divisi: data.divisi || "pendidikan",
          jamMulai: data.jamMulai || "",
          jamSelesai: data.jamSelesai || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg"
        >
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
            <InputTextArea
              name="deskripsi"
              label="*Deskripsi Kegiatan"
              placeholder="Masukkan deskripsi kegiatan (maksimal 500 karakter, minimal 50 karakter)"
              value={formData.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              isError={errors.deskripsi}
              rows={5}
            />
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                *Divisi Penyelenggara
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
              label="*Lokasi"
              placeholder="Contoh: Aula Kampus / Online"
              name="lokasi"
              type="text"
              value={formData.lokasi}
              onChange={(e) => handleChange("lokasi", e.target.value)}
              isError={errors.lokasi}
            />
            <InputText
              label="*Maps (Google Maps URL)"
              placeholder="Contoh: https://www.google.com/maps/place/..."
              name="maps"
              type="text"
              value={formData.maps}
              onChange={(e) => handleChange("maps", e.target.value)}
              isError={errors.maps}
            />
            <InputDate
              label="*Tanggal Pelaksanaan"
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
              <label className="text-sm font-medium text-gray-700">
                *Status
              </label>
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
                className={`text-white ${!isFormValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer hover:bg-primary-dark"
                  } rounded-lg px-4 py-2 font-semibold transition-colors`}
              >
                Update Kegiatan
              </button>
            </div>
          </div>
        </form>
      )}
    </DashboardSection>
  );
}
