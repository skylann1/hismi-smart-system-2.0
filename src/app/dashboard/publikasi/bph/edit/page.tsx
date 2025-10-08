"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import { useState, useEffect } from "react";

import InputFile from "@/components/ui/moleculs/input/InputFile";

// Interface untuk data form BPH
export interface BphSettingsFormData {
  images: {
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | File | null;
  };
}

interface StatusField {
  status: boolean;
  message: string;
}

interface StatusForm {
  images: {
    image1: StatusField;
    image2: StatusField;
    image3: StatusField;
    image4: StatusField;
  };
}

const mockExistingBphData: BphSettingsFormData = {
  images: {
    image1: "/assets/static-img/bph-1.jpg",
    image2: "/assets/static-img/bph-2.jpg",
    image3: null,
    image4: null,
  },
};

// === KOMPONEN UTAMA (INDUK) ===
export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BphSettingsFormData>({
    images: {
      image1: null,
      image2: null,
      image3: null,
      image4: null,
    },
  });
  const [formStatus, setFormStatus] = useState<StatusForm>({
    images: {
      image1: { status: true, message: "" },
      image2: { status: true, message: "" },
      image3: { status: true, message: "" },
      image4: { status: true, message: "" },
    },
  });

  useEffect(() => {
    const fetchBphData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setFormData(mockExistingBphData);
      } catch (error) {
        console.error("Gagal mengambil data BPH:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBphData();
  }, []);

  useEffect(() => {
    const errors: StatusForm = {
      images: {
        image1: { status: false, message: "" },
        image2: { status: false, message: "" },
        image3: { status: false, message: "" },
        image4: { status: false, message: "" },
      },
    };

    // --- Images ---
    (Object.keys(formData.images) as (keyof typeof formData.images)[]).forEach(
      (key) => {
        const file = formData.images[key];

        // --- Required ---
        if (!file) {
          errors.images[key] = {
            status: true,
            message: `${key} is required`,
          };
          return; // stop here kalau kosong
        }

        if (typeof file === "string") {
          // Jika berupa string (URL), anggap valid
          errors.images[key] = { status: false, message: "" };
          return;
        }

        if (file instanceof File) {
          // Check format
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!allowedTypes.includes(file.type)) {
            errors.images[key] = {
              status: true,
              message: `${key} must be JPG or PNG`,
            };
            return;
          }

          // Check size (max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            errors.images[key] = {
              status: true,
              message: `${key} must be smaller than 5MB`,
            };
            return;
          }
        }

        errors.images[key] = { status: false, message: "" };
      }
    );

    setFormStatus(errors);
  }, [formData]);

  const handleImageChange = (
    imageKey: keyof BphSettingsFormData["images"],
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      images: { ...prev.images, [imageKey]: file },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();
    for (const [key, value] of Object.entries(formData.images)) {
      if (value instanceof File) {
        submissionData.append(key, value);
      } else if (typeof value === "string" && value) {
        submissionData.append(`${key}_url`, value);
      }
    }
    // Lakukan sesuatu dengan submissionData, misalnya kirim ke API
    console.log("Submitting BPH data:", formData);
    // Tambahkan logika pengiriman data ke backend di sini
  };

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Edit Publikasi BPH
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Ubah konten halaman publik Badan Pengurus Harian Anda. Unggah gambar
          terbaik BPH!
        </span>
        <div className="w-full sm:w-3/4 mt-4">
          <Image
            src="/assets/undraw/image_upload.svg" // Ilustrasi yang lebih relevan
            height={5000}
            width={5000}
            alt="image upload illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <p className="text-gray-500">Memuat data BPH...</p>
          </div>
        ) : (
          <FormImages
            formData={formData}
            handleImageChange={handleImageChange}
            formStatus={formStatus}
          />
        )}
      </form>
    </DashboardSection>
  );
}

// --- KOMPONEN FORM GAMBAR KHUSUS BPH ---
interface FormImagesProps {
  formData: BphSettingsFormData;
  handleImageChange: (
    imageKey: keyof BphSettingsFormData["images"],
    file: File | null
  ) => void;
  formStatus?: StatusForm;
}
const FormImages = ({ formData, handleImageChange, formStatus }: FormImagesProps) => {
  const isStepValid = !Object.values(formStatus?.images || {}).some(
    (field) => field.status
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Galeri Gambar BPH</h2>
      <p className="text-sm text-gray-500 mt-1">
        Unggah hingga 4 gambar terbaik untuk galeri Badan Pengurus Harian.
      </p>
      <div className="mt-8 flex flex-col gap-8">
        {(
          Object.keys(formData.images) as Array<
            keyof BphSettingsFormData["images"]
          >
        ).map((key, index) => (
          <InputFile
            key={key}
            label={`Gambar ${index + 1}`}
            name={key}
            value={formData.images[key]}
            onChange={(file) => handleImageChange(key, file)}
            isError={formStatus?.images[key]}
          />
        ))}
        <div className="w-full flex justify-end items-center mt-6">
          <button
            type="submit"
            disabled={!isStepValid}
            className={`text-white font-semibold ${
              !isStepValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary cursor-pointer hover:bg-primary-dark"
            } rounded-lg px-4 py-2`}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};