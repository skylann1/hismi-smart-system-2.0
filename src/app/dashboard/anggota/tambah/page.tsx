"use client";
import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import InputSelectYear from "@/components/ui/moleculs/input/InputSelectYear";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useMemo, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import InputFile from "@/components/ui/moleculs/input/InputFile";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import { useRouter } from "next/navigation";

interface formData {
  nama: string;
  tanggal_lahir: string;
  email: string;
  no_hp: string;
  nim: string;
  jenjang_pendidikan: string;
  semester: number;
  tipe_kelas: string;
  tahun_masuk: string;
  divisi: string;
  role: string;
  image: File | null;
}
type formInputIsValidType = [boolean, boolean, boolean];
const formInputConcept = ["umum", "akademik", "himsi"];

export default function Page() {
  const dispatch = useAppDispatch();
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({
    nama: {
      status: false,
      message: "",
    },
    tanggal_lahir: {
      status: false,
      message: "",
    },
    email: {
      status: false,
      message: "",
    },
    no_hp: {
      status: false,
      message: "",
    },
    nim: {
      status: false,
      message: "",
    },
    tahun_masuk: {
      status: false,
      message: "",
    },
    image: { status: false, message: "" },
  });
  const [formData, setFormData] = useState<formData>({
    nama: "",
    tanggal_lahir: "",
    email: "",
    no_hp: "",
    nim: "",
    jenjang_pendidikan: "s1",
    semester: 1,
    tipe_kelas: "pagi",
    tahun_masuk: "",
    divisi: "pendidikan",
    role: "anggota",
    image: null,
  });

  const validateField = (field: string, value: string) => {
    let error = { status: false, message: "" };

    switch (field) {
      case "nama":
        if (!value.trim()) {
          error = { status: true, message: "Nama wajib diisi" };
        } else if (value.trim().length < 3) {
          error = { status: true, message: "Nama minimal 3 karakter" };
        }
        break;

      case "email":
        if (!value.trim()) {
          error = { status: true, message: "Email wajib diisi" };
        } else if (value.trim().length < 6) {
          error = { status: true, message: "Email minimal 6 karakter" };
        } else if (!value.includes("@")) {
          error = { status: true, message: "Email tidak valid" };
        }
        break;

      case "tanggal_lahir":
        if (!value) {
          error = { status: true, message: "Tanggal lahir wajib diisi" };
        } else {
          const umur = calculateUmur(value);
          const isTooOld = typeof umur === "number" && umur > 120;
          const isTooYoung = typeof umur === "number" && umur < 17;
          const err = isTooOld || isTooYoung;
          if (err) {
            error = {
              status: true,
              message: isTooOld ? `Umur max 120` : "Umur min 17",
            };
          }
        }
        break;

      case "no_hp":
        if (!value) {
          error = { status: true, message: "No HP wajib diisi" };
        } else if (!/^[0-9]{10,15}$/.test(value.trim())) {
          error = {
            status: true,
            message: "Nomor telepon harus 10–15 digit angka",
          };
        }
        break;

      case "nim":
        if (!value) {
          error = { status: true, message: "NIM wajib diisi" };
        } else if (value.trim().length < 8) {
          error = { status: true, message: "NIM minimal 8 huruf" };
        }
        break;

      case "tahun_masuk":
        if (!value) {
          error = { status: true, message: "Tahun Masuk wajib diisi" };
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    validateField(field, value);
  };

  const [formInput, setFormInput] = useState(formInputConcept[0]);
  const [formInputIsValid, setFormInputIsValid] =
    useState<formInputIsValidType>([true, true, true]);

  const jenjang = [
    { value: "s1", label: "S1" },
    { value: "d3", label: "D3" },
  ];

  const tipeKelas = [
    { value: "pagi", label: "Pagi" },
    { value: "sore", label: "Sore" },
  ];

  const semester = [
    { value: 1, label: "Semester 1" },
    { value: 2, label: "Semester 2" },
    { value: 3, label: "Semester 3" },
    { value: 4, label: "Semester 4" },
    { value: 5, label: "Semester 5" },
    { value: 6, label: "Semester 6" },
    { value: 7, label: "Semester 7" },
  ];

  const divisi = [
    { value: "pendidikan", label: "Pendidikan" },
    { value: "kominfo", label: "Kominfo" },
    { value: "litbang", label: "Litbang" },
    { value: "rsdm", label: "Rsdm" },
    { value: "bph", label: "BPH" },
  ];

  const role = [
    { value: "anggota", label: "Anggota" },
    { value: "koordinator", label: "Koordinator" },
    { value: "wakil-koordinator", label: "Wakil Koordinator" },
    { value: "ketua", label: "Ketua" },
    { value: "wakil-ketua", label: "Wakil Ketua" },
    { value: "sekretaris", label: "Sekretaris" },
    { value: "bendahara", label: "Bendahara" },
  ];

  const filteredRoles = useMemo(() => {
    if (formData.divisi !== "bph") {
      return role.filter((r) =>
        ["anggota", "koordinator", "wakil-koordinator"].includes(
          r.value.toLowerCase()
        )
      );
    } else {
      return role.filter((r) =>
        ["ketua", "wakil-ketua", "sekretaris", "bendahara"].includes(
          r.value.toLowerCase()
        )
      );
    }
  }, [formData.divisi, errors]);

  useEffect(() => {
    const isGeneralInvalid =
      !formData.email.trim() ||
      !formData.no_hp.trim() ||
      !formData.nama.trim() ||
      !formData.tanggal_lahir ||
      errors.email.status ||
      errors.no_hp.status ||
      errors.nama.status ||
      errors.tanggal_lahir.status;

    const isAcademicInvalid = !formData.nim.trim() || errors.nim.status;

    const isHimsiInvalid =
      !formData.tahun_masuk.trim() || errors.tahun_masuk.status;

    setFormInputIsValid([isGeneralInvalid, isAcademicInvalid, isHimsiInvalid]);
  }, [formData, errors]);

  function calculateUmur(value: string): number | null {
    if (!value) return null;
    const dob = new Date(value);
    const today = new Date();
    let diff = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      diff--;
    }
    return diff;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageError = validateImage(formData.image);
    setErrors((prev) => ({ ...prev, image: imageError }));

    if (imageError.status) {
      console.log("Validasi gagal:", imageError.message);
      return;
    }

    try {
      setSubmitLoading(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === "image" && value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      const res = await fetch("/dashboard/api/anggota/tambah-anggota", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        dispatch(
          alertIsAktif({ status: true, title: "Success! Your changes have been saved", message: data.message })
        );
        setFormData({
          nama: "",
          tanggal_lahir: "",
          email: "",
          no_hp: "",
          nim: "",
          jenjang_pendidikan: "s1",
          semester: 1,
          tipe_kelas: "pagi",
          tahun_masuk: "",
          divisi: "pendidikan",
          role: "anggota",
          image: null,
        });
        router.push("/dashboard/anggota");
      } else {
        dispatch(
          alertIsAktif({ status: false, title: "Oops! Your changes have not been saved.", message: data.message })
        );
      }
    } catch (err) {
      console.log(err);
    }
    setSubmitLoading(false);
  };

  const handleImageChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // langsung validasi pas ganti
    setErrors((prev) => ({
      ...prev,
      image: validateImage(file),
    }));
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

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      {/* Left Section */}
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
            src="/assets/undraw/data_input.svg"
            height={5000}
            width={5000}
            alt="data input illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      {/* Right Section (Form) */}
      <form
        className="w-full bg-white rounded-lg p-4 sm:p-6 transition-all duration-1000 ease-in-out relative shadow-lg"
        onSubmit={handleSubmit}
      >
        {/* Informasi Umum */}
        <div
          className={`w-full flex flex-col transition-all duration-300 ease-in-out ${
            formInput !== "umum"
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Informasi Umum
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <InputFile
              label="*Foto profil"
              name="image"
              value={formData.image}
              onChange={(file: File | null) => handleImageChange(file)}
              isError={errors.image}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 gap-y-6">
              <InputText
                label="*Nama"
                placeholder="Masukkan nama lengkap"
                name="name"
                type="text"
                onChange={(e) => handleChange("nama", e.target.value)}
                isError={errors.nama}
              />
              <InputDate
                onChange={(e) => handleChange("tanggal_lahir", e)}
                value={formData.tanggal_lahir}
                isError={errors.tanggal_lahir}
              />
            </div>
            <InputText
              label="*Email"
              placeholder="Masukkan email"
              name="email"
              type="email"
              onChange={(e) => handleChange("email", e.target.value)}
              isError={errors.email}
            />
            <InputText
              label="*No Tlpn"
              placeholder="Masukkan no tlpn"
              name="no_tlpn"
              type="number"
              onChange={(e) => handleChange("no_hp", e.target.value)}
              isError={errors.no_hp}
            />
            <div className="w-full flex justify-end pb-1 mt-6">
              <button
                type="button"
                disabled={formInputIsValid[0]}
                aria-disabled={formInputIsValid[0]}
                className={`text-white ${
                  formInputIsValid[0]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer"
                } rounded-lg px-3 py-1`}
                onClick={() => setFormInput("akademik")}
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {/* Informasi Akademik */}
        <div
          className={`w-full flex flex-col transition-all duration-300 ease-in-out ${
            formInput !== "akademik"
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Informasi Akademik
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputText
                label="*Nim"
                placeholder="Masukkan nim"
                name="nim"
                type="text"
                onChange={(e) => handleChange("nim", e.target.value)}
                isError={errors.nim}
              />
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-gray-700">
                  *Jenjang pendidikan
                </label>
                <RadioButtonGroup
                  className="grid grid-cols-2 gap-2"
                  options={jenjang}
                  name="jenjang_pendidikan"
                  value={formData.jenjang_pendidikan}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      jenjang_pendidikan: String(value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                *Semester
              </label>
              <RadioButtonGroup
                className="grid grid-cols-3 gap-2"
                options={semester}
                name="semester"
                value={formData.semester}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    semester: Number(value),
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700">
                *Tipe kelas
              </label>
              <RadioButtonGroup
                className="grid grid-cols-2 gap-2"
                options={tipeKelas}
                name="tipe_kelas"
                value={formData.tipe_kelas}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipe_kelas: String(value),
                  }))
                }
              />
            </div>
            <div className="w-full flex justify-between items-center pb-1 mt-6">
              <ButtonBackForm onClick={() => setFormInput("umum")} />
              <button
                type="button"
                disabled={formInputIsValid[1]}
                aria-disabled={formInputIsValid[1]}
                className={`text-white ${
                  formInputIsValid[1]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer"
                } rounded-lg px-3 py-1`}
                onClick={() => setFormInput("himsi")}
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {/* Informasi HIMSI */}
        <div
          className={`w-full flex flex-col transition-all duration-300 ease-in-out ${
            formInput !== "himsi"
              ? "opacity-0 pointer-events-none absolute"
              : "opacity-100"
          }`}
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Informasi keanggotaan HIMSI
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            <InputSelectYear
              value={formData.tahun_masuk}
              onChange={(e) => handleChange("tahun_masuk", e.target.value)}
              label="Tahun masuk"
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                *Divisi
              </label>
              <RadioButtonGroup
                className="grid grid-cols-3 gap-2"
                options={divisi}
                name="divisi"
                value={formData.divisi}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    divisi: String(value),
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">*Role</label>
              <RadioButtonGroup
                className="grid grid-cols-2 gap-2"
                options={filteredRoles}
                name="role"
                value={formData.role}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: String(value),
                  }))
                }
              />
            </div>
            <div className="w-full flex justify-between items-center pb-1 mt-6">
              <ButtonBackForm onClick={() => setFormInput("akademik")} />
              <button
                type="submit"
                disabled={formInputIsValid[2] || submitLoading}
                aria-disabled={formInputIsValid[2] || submitLoading}
                className={`text-white ${
                  formInputIsValid[2] || submitLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary cursor-pointer"
                } rounded-lg px-3 py-1`}
              >
                 {submitLoading ? "wait..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}

interface ButtonBackFormProps {
  onClick: (args: string) => void;
}

const ButtonBackForm = ({ onClick }: ButtonBackFormProps) => {
  return (
    <div
      className="flex gap-0 justify-center items-center text-black opacity-70 hover:opacity-100 cursor-pointer font-medium transition-all ease-in-out duration-300"
      onClick={() => onClick("")}
    >
      <IoIosArrowBack className="text-lg mt-0.5" />
      Kembali
    </div>
  );
};
