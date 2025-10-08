"use client";
import DashboardSection from "@/components/ui/templates/DashboardSection";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaTrashArrowUp } from "react-icons/fa6"; // Contoh ikon, ganti sesuai library
import InputFile from "@/components/ui/moleculs/input/InputFile";
import InputTextArea from "@/components/ui/moleculs/input/InputArea";
import Image from "next/image";
import { useRouter } from "next/navigation";

// === INTERFACE DIUPDATE ===
interface Paragraph {
  konten: string;
}

interface FormArtikel {
  judul: string;
  author: string;
  paragraf: Paragraph[];
  kategori: string;
  tanggal: string;
  status: string;
  cover: File | null;
  gambar_tambahan: {
    gambar1: File | null;
    gambar2: File | null;
  };
}

// === KOMPONEN UTAMA ===
export default function Page() {

  const router = useRouter();
  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    author: { status: false, message: "" },
    paragraf: [{ status: false, message: "" }],
    tanggal: { status: false, message: "" },
    cover: { status: false, message: "" },
    gambar_tambahan: {
      gambar1: { status: false, message: "" },
      gambar2: { status: false, message: "" },
    },
  });

  const [formData, setFormData] = useState<FormArtikel>({
    judul: "",
    author: "",
    paragraf: [{ konten: "" }],
    kategori: "umum",
    tanggal: "",
    status: "draft",
    cover: null,
    gambar_tambahan: {
      gambar1: null,
      gambar2: null,
    },
  });

  const [formStep, setFormStep] = useState<
    "informasi" | "konten" | "gambar_tambahan"
  >("informasi");
  const [formInputIsValid, setFormInputIsValid] = useState<
    [boolean, boolean, boolean]
  >([true, true, true]);

  const kategori = [
    { value: "umum", label: "Umum" },
    { value: "pengetahuan", label: "Pengetahuan" },
    { value: "pengumuman", label: "Pengumuman" },
    { value: "akademik", label: "Akademik" },
    { value: "event", label: "Event" },
  ];

  const statusPublikasi = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  // --- VALIDASI DIPERBAIKI ---
  const validateField = (
    field: keyof Omit<FormArtikel, "paragraf" | "gambar_tambahan" | "cover">,
    value: string
  ) => {
    let error = { status: false, message: "" };
    switch (field) {
      case "judul":
        if (!value.trim())
          error = { status: true, message: "Judul wajib diisi" };
        else if (value.trim().length < 5)
          error = { status: true, message: "Judul minimal 5 karakter" };
        break;
      case "author":
        if (!value.trim())
          error = { status: true, message: "Author wajib diisi" };
        else if (value.trim().length < 5)
          error = { status: true, message: "Author minimal 5 karakter" };
        break;
      case "tanggal":
        if (!value) error = { status: true, message: "Tanggal wajib diisi" };
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateImage = (
    file: File | null
  ): { status: boolean; message: string } => {
    if (!file) {
      return { status: true, message: "Gambar wajib di-upload" };
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { status: true, message: "Format harus JPG, PNG, atau WebP" };
    }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      return { status: true, message: "Ukuran maksimal 2MB" };
    }
    return { status: false, message: "" };
  };

  const handleChange = (
    field: keyof Omit<FormArtikel, "cover" | "paragraf" | "gambar_tambahan">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value); // Panggil validasi di sini agar error di-set
  };

  const handleCoverChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, cover: file }));
    setErrors((prev) => ({ ...prev, cover: validateImage(file) }));
  };

  const handleAdditionalImageChange = (
    key: "gambar1" | "gambar2",
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      gambar_tambahan: { ...prev.gambar_tambahan, [key]: file },
    }));
    setErrors((prev) => ({
      ...prev,
      gambar_tambahan: { ...prev.gambar_tambahan, [key]: validateImage(file) },
    }));
  };

  const addParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraf: [...prev.paragraf, { konten: "" }],
    }));
  };

  const removeParagraph = (index: number) => {
    if (formData.paragraf.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      paragraf: prev.paragraf.filter((_, i) => i !== index),
    }));
  };

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...formData.paragraf];
    newParagraphs[index].konten = value;
    setFormData((prev) => ({ ...prev, paragraf: newParagraphs }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    router.push('result');
    // alert("Artikel berhasil disubmit! Cek console.");
  };

  useEffect(() => {
    const isInformasiInvalid =
      errors.judul.status ||
      errors.author.status ||
      errors.tanggal.status ||
      errors.cover.status ||
      !formData.tanggal ||
      !formData.cover;

    const isKontenInvalid = formData.paragraf.some(
      (p) => p.konten.trim().length < 20
    );

    const isGambarInvalid =
      errors.gambar_tambahan.gambar1.status ||
      errors.gambar_tambahan.gambar2.status ||
      !formData.gambar_tambahan.gambar1 ||
      !formData.gambar_tambahan.gambar2;

    setFormInputIsValid([isInformasiInvalid, isKontenInvalid, isGambarInvalid]);
  }, [formData, errors]);


  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Tambah anggota HIMSI kaliabang
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Semua data yang diinput dapat diakses dan dikelola oleh pengurus HIMSI
          kaliabang, dan jika ada kesalahan pada pengisian data anggota, data
          tersebut dapat diubah maupun dihapus oleh pengurus. Gunakan fitur ini
          dengan baik dan cermat.
        </span>
        <div className="w-full sm:w-3/4 mt-4">
          <Image
            src="/assets/undraw/newspaper.svg"
            height={5000}
            width={5000}
            alt="data input illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg p-4 sm:p-6 relative shadow-lg overflow-hidden"
      >
        {/* Step 1: Informasi Artikel */}
        <div
          className={`flex flex-col transition-all duration-300 ease-in-out ${
            formStep !== "informasi"
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Langkah 1: Informasi Artikel
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <InputText
              type="text"
              label="*Judul"
              name="judul"
              placeholder="Minimal 5 karakter"
              value={formData.judul}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("judul", e.target.value)
              }
              isError={errors.judul}
            />
            <InputText
              type="text"
              label="*Author"
              name="author"
              placeholder="Minimal 5 karakter"
              value={formData.author}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("author", e.target.value)
              }
              isError={errors.author}
            />
            <InputDate
              label="*Tanggal Publikasi"
              onChange={(e: string) => handleChange("tanggal", e)}
              value={formData.tanggal}
              isError={errors.tanggal}
            />
            <InputFile
              label="*Cover Artikel (Gambar Utama)"
              name="cover"
              value={formData.cover}
              onChange={handleCoverChange}
              isError={errors.cover}
            />
            <div className="flex flex-col gap-3">
              <label
                htmlFor="kategori"
                className="text-sm font-medium text-gray-700"
              >
                Kategori
              </label>
              <RadioButtonGroup
                options={kategori}
                name="kategori"
                value={formData.kategori}
                onChange={(value) => handleChange("kategori", String(value))}
                className="grid grid-cols-3 gap-2"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status Publikasi
              </label>
              <RadioButtonGroup
                options={statusPublikasi}
                name="status"
                value={formData.status}
                onChange={(value) => handleChange("status", String(value))}
                className="grid grid-cols-2 gap-2"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                disabled={formInputIsValid[0]}
                onClick={() => setFormStep("konten")}
                className={`text-white ${
                  formInputIsValid[0]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer"
                } rounded-lg px-4 py-2`}
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Konten Artikel */}
        <div
          className={`flex flex-col transition-all duration-300 ease-in-out ${
            formStep !== "konten"
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Langkah 2: Konten Artikel
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-gray-700">
                *Isi Artikel (Paragraf)
              </label>
              {formData.paragraf.map((p, index) => (
                <div key={index} className="relative">
                  <InputTextArea
                    label={`Paragraf ${index + 1}`}
                    name={`paragraf_${index}`}
                    placeholder="Minimal 20 karakter"
                    value={p.konten}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleParagraphChange(index, e.target.value)
                    }
                    rows={5}
                  />
                  {formData.paragraf.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="absolute top-0 right-0 p-1 text-red-500 transition-transform hover:scale-110"
                    >
                      <FaTrashArrowUp />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addParagraph}
                className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                + Tambah Paragraf
              </button>
            </div>
            <div className="flex justify-between mt-6">
              <ButtonBackForm onClick={() => setFormStep("informasi")} />
              <button
                type="button"
                disabled={formInputIsValid[1]}
                onClick={() => setFormStep("gambar_tambahan")}
                className={`text-white ${
                  formInputIsValid[1]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer"
                } rounded-lg px-4 py-2`}
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Gambar Tambahan */}
        <div
          className={`flex flex-col transition-all duration-300 ease-in-out ${
            formStep !== "gambar_tambahan"
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Langkah 3: Gambar Tambahan
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <p className="text-sm text-gray-500 -mt-4">
              Upload dua gambar pendukung untuk melengkapi isi artikel Anda.
            </p>
            <InputFile
              label="*Gambar Tambahan 1"
              name="gambar1"
              value={formData.gambar_tambahan.gambar1}
              onChange={(file) => handleAdditionalImageChange("gambar1", file)}
              isError={errors.gambar_tambahan.gambar1}
            />
            <InputFile
              label="*Gambar Tambahan 2"
              name="gambar2"
              value={formData.gambar_tambahan.gambar2}
              onChange={(file) => handleAdditionalImageChange("gambar2", file)}
              isError={errors.gambar_tambahan.gambar2}
            />
            <div className="flex justify-between mt-6">
              <ButtonBackForm onClick={() => setFormStep("konten")} />
              <button
                type="submit"
                disabled={formInputIsValid[2]}
                className={`text-white ${
                  formInputIsValid[2]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer"
                } rounded-lg px-4 py-2`}
              >
                Submit Artikel
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}

interface ButtonBackFormProps {
  onClick: () => void;
}
const ButtonBackForm = ({ onClick }: ButtonBackFormProps) => {
  return (
    <div
      className="flex gap-0 justify-center items-center text-black opacity-70 hover:opacity-100 cursor-pointer font-medium transition-all ease-in-out duration-300"
      onClick={onClick}
    >
      <IoIosArrowBack className="text-lg mt-0.5" />
      Kembali
    </div>
  );
};
