"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect, use } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import { useRouter } from "next/navigation";
import InputTime from "@/components/ui/moleculs/input/InputTime";

interface PertemuanFormData {
  judul: string;
  lokasi: string;
  maps: string;
  tanggal: string;
  status: "Upcoming" | "Passed" | "Ongoing";
  metode: "Offline" | "Online";
  penanggungJawab?: string;
  nomerPenanggungJawab?: string;
  jamMulai: string;
  jamSelesai: string;
}

export default function EditPertemuanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<PertemuanFormData>({
    judul: "",
    lokasi: "",
    maps: "",
    tanggal: "",
    status: "Upcoming",
    metode: "Offline",
    penanggungJawab: "",
    nomerPenanggungJawab: "",
    jamMulai: "",
    jamSelesai: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    lokasi: { status: false, message: "" },
    tanggal: { status: false, message: "" },
    penanggungJawab: { status: false, message: "" },
    nomerPenanggungJawab: { status: false, message: "" },
    maps: { status: false, message: "" },
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

      case "maps":
        if (value.trim()) {
          try {
            new URL(value);
          } catch {
            error = { status: true, message: "Link tidak valid" };
          }
        }
        break;

      case "tanggal":
        if (!value) error = { status: true, message: "Tanggal wajib diisi" };
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
      case "penanggungJawab":
        if (!value.trim())
          error = { status: true, message: "Penanggung jawab wajib diisi" };
        else if (/\d/.test(value))
          error = {
            status: true,
            message: "Nama tidak boleh mengandung angka",
          };
        break;

      case "nomerPenanggungJawab":
        if (!value.trim())
          error = {
            status: true,
            message: "Nomor penanggung jawab wajib diisi",
          };
        else if (!/^\d+$/.test(value))
          error = { status: true, message: "Nomor hanya boleh berisi angka" };
        else if (value.length < 10)
          error = { status: true, message: "Nomor minimal 10 digit" };
        else if (value.length > 15)
          error = { status: true, message: "Nomor maksimal 15 digit" };
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

  const statusOptions = [
    { value: "Upcoming", label: "Upcoming" },
    { value: "Passed", label: "Passed" },
    { value: "Ongoing", label: "Ongoing" },
  ];

  const metodeOptions = [
    { value: "Offline", label: "Offline" },
    { value: "Online", label: "Online" },
  ];

  useEffect(() => {
    const isErrorPresent = Object.values(errors).some((error) => error.status);
    const isDataMissing =
      !formData.judul ||
      !formData.lokasi ||
      !formData.tanggal ||
      !formData.penanggungJawab ||
      !formData.nomerPenanggungJawab;

    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/api/pertemuan?id=${id}`,
          { cache: "no-store" }
        );
        const json = await response.json();
        const data = json.data;

        if (!response.ok) throw new Error("Failed to fetch data");
        setFormData({
          judul: data.judul || "",
          lokasi: data.lokasi || "",
          maps: data.maps || "",
          tanggal: data.tanggal || "",
          status: data.status || "Upcoming",
          metode: data.metode || "Offline",
          penanggungJawab: data.penanggungJawab || "",
          nomerPenanggungJawab: data.nomerPenanggungJawab || "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isFormValid) {
        const submitData = async () => {
          const response = await fetch(`${url}/dashboard/api/pertemuan/edit`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, id }),
          });

          const result = await response.json();
          if (!response.ok) {
            dispatch(
              alertIsAktif({
                status: false,
                title: "Oops! Your changes have not been saved",
                message: result.message,
              })
            );
            throw new Error("Network response was not ok");
          }

          dispatch(
            alertIsAktif({
              status: true,
              title: "Success! Your changes have been saved",
              message: result.message,
            })
          );
        };
        submitData();
        router.push("/dashboard/pertemuan");
      } else {
        alert("Masih ada data yang belum valid bro 🚫");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setFormData({
        judul: "",
        lokasi: "",
        maps: "",
        tanggal: "",
        status: "Upcoming",
        metode: "Offline",
        penanggungJawab: "",
        nomerPenanggungJawab: "",
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
          Tambah Jadwal Pertemuan Baru
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Buat jadwal pertemuan atau acara baru untuk HIMSI. Informasi yang
          diinput akan langsung dapat dilihat oleh semua anggota setelah
          disimpan.
        </span>
        <div className="w-full sm:w-3/4 mt-4 flex justify-center">
          <Image
            src="/assets/undraw/conversation.svg"
            height={5000}
            width={5000}
            alt="add events illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full min-h-[300px] bg-white">
          <p className="text-gray-500">Memuat data BPH...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Form Tambah Pertemuan
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
            <InputText
              label="Maps / Online Link"
              placeholder="Contoh: https://maps.app.goo.gl/nJYnmts6xEj2hAy9A"
              name="maps"
              type="text"
              value={formData.maps}
              onChange={(e) => handleChange("maps", e.target.value)}
              isError={errors.maps}
            />
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                *Metode
              </label>
              <RadioButtonGroup
                className="grid grid-cols-2 gap-2"
                options={metodeOptions}
                name="metode"
                value={formData.metode}
                onChange={(value) => handleChange("metode", String(value))}
              />
            </div>
            <InputDate
              label="*Tanggal Pertemuan"
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
            <InputText
              label="*Penanggung Jawab"
              placeholder="Contoh: Irfan Hakim"
              name="penanggungJawab"
              type="text"
              value={formData.penanggungJawab}
              onChange={(e) => handleChange("penanggungJawab", e.target.value)}
              isError={errors.penanggungJawab}
            />
            <InputText
              label="*Nomor Penanggung Jawab"
              placeholder="Contoh: 08123456789"
              name="nomerPenanggungJawab"
              type="text"
              value={formData.nomerPenanggungJawab}
              onChange={(e) =>
                handleChange("nomerPenanggungJawab", e.target.value)
              }
              isError={errors.nomerPenanggungJawab}
            />
            <div className="w-full flex justify-end pb-1 mt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`text-white ${!isFormValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer hover:bg-primary-dark"
                  } rounded-lg px-4 py-2 font-semibold transition-colors`}
              >
                Tambah Pertemuan
              </button>
            </div>
          </div>
        </form>
      )}
    </DashboardSection>
  );
}
