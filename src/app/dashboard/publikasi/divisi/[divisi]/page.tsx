"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputTextArea from "@/components/ui/moleculs/input/InputArea";
import InputFile from "@/components/ui/moleculs/input/InputFile";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";

export interface PoinDivisi {
  title: string;
  description: string;
}
export interface DivisiSettingsFormData {
  mainTitle: string;
  secondaryTitle: string;
  mainDescription: string;
  secondaryDescription: string;
  poinDivisi: PoinDivisi[];
  images: {
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | File | null;
    image5: string | File | null;
  };
}

interface StatusField {
  status: boolean;
  message: string;
}
interface StatusForm {
  mainTitle: StatusField;
  secondaryTitle: StatusField;
  mainDescription: StatusField;
  secondaryDescription: StatusField;
  poinDivisi: {
    poin1: {
      title: StatusField;
      description: StatusField;
    };
    poin2: {
      title: StatusField;
      description: StatusField;
    };
    poin3: {
      title: StatusField;
      description: StatusField;
    };
  };
  images: {
    image1: StatusField;
    image2: StatusField;
    image3: StatusField;
    image4: StatusField;
    image5: StatusField;
  };
}

// === KOMPONEN UTAMA (INDUK) ===
export default function Page() {
  const divisi = useParams().divisi;
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState<DivisiSettingsFormData>({
    mainTitle: "",
    secondaryTitle: "",
    mainDescription: "",
    secondaryDescription: "",
    poinDivisi: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    images: {
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
    },
  });

  const [formStatus, setFormStatus] = useState<StatusForm>({
    mainTitle: { status: true, message: "" },
    secondaryTitle: { status: true, message: "" },
    mainDescription: { status: true, message: "" },
    secondaryDescription: { status: true, message: "" },
    poinDivisi: {
      poin1: {
        title: { status: true, message: "" },
        description: { status: true, message: "" },
      },
      poin2: {
        title: { status: true, message: "" },
        description: { status: true, message: "" },
      },
      poin3: {
        title: { status: true, message: "" },
        description: { status: true, message: "" },
      },
    },
    images: {
      image1: { status: true, message: "" },
      image2: { status: true, message: "" },
      image3: { status: true, message: "" },
      image4: { status: true, message: "" },
      image5: { status: true, message: "" },
    },
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchDivisiData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/dashboard/api/publikasi/divisi/${divisi}`);
        const data = await res.json();
        if (data.success === false) throw new Error(data.message);
        setFormData(data.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDivisiData();
  }, [divisi]);

  useEffect(() => {
    const errors: StatusForm = {
      mainTitle: { status: false, message: "" },
      secondaryTitle: { status: false, message: "" },
      mainDescription: { status: false, message: "" },
      secondaryDescription: { status: false, message: "" },
      poinDivisi: {
        poin1: {
          title: { status: false, message: "" },
          description: { status: false, message: "" },
        },
        poin2: {
          title: { status: false, message: "" },
          description: { status: false, message: "" },
        },
        poin3: {
          title: { status: false, message: "" },
          description: { status: false, message: "" },
        },
      },
      images: {
        image1: { status: false, message: "" },
        image2: { status: false, message: "" },
        image3: { status: false, message: "" },
        image4: { status: false, message: "" },
        image5: { status: false, message: "" },
      },
    };

    // --- Titles ---
    if (formData.mainTitle.length < 10 || formData.mainTitle.length > 50) {
      errors.mainTitle = {
        status: true,
        message: "Main title must be between 10 and 50 characters",
      };
    }

    if (
      formData.secondaryTitle.length < 10 ||
      formData.secondaryTitle.length > 50
    ) {
      errors.secondaryTitle = {
        status: true,
        message: "Secondary title must be between 10 and 50 characters",
      };
    }

    // --- Descriptions ---
    if (
      formData.mainDescription.length < 100 ||
      formData.mainDescription.length > 200
    ) {
      errors.mainDescription = {
        status: true,
        message: "Main description must be between 100 and 200 characters",
      };
    }

    if (
      formData.secondaryDescription.length < 100 ||
      formData.secondaryDescription.length > 300
    ) {
      errors.secondaryDescription = {
        status: true,
        message: "Secondary description must be between 100 and 300 characters",
      };
    }

    // --- Poin Divisi ---
    formData.poinDivisi.forEach((poin, index) => {
      const key = `poin${index + 1}` as keyof typeof errors.poinDivisi;

      if (poin.title.length < 10 || poin.title.length > 50) {
        errors.poinDivisi[key].title = {
          status: true,
          message: `Poin ${
            index + 1
          } title must be between 10 and 50 characters`,
        };
      }

      if (poin.description.length < 150 || poin.description.length > 500) {
        errors.poinDivisi[key].description = {
          status: true,
          message: `Poin ${
            index + 1
          } description must be between 200 and 500 characters`,
        };
      }
    });

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

  const handleChange = (field: keyof DivisiSettingsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handlePoinDivisiChange = (
    index: number,
    field: keyof PoinDivisi,
    value: string
  ) => {
    const updatedPoin = [...formData.poinDivisi];
    updatedPoin[index] = { ...updatedPoin[index], [field]: value };
    setFormData((prev) => ({ ...prev, poinDivisi: updatedPoin }));
  };
  const handleImageChange = (
    imageKey: keyof DivisiSettingsFormData["images"],
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
    submissionData.append("mainTitle", formData.mainTitle);
    submissionData.append("secondaryTitle", formData.secondaryTitle);
    submissionData.append("mainDescription", formData.mainDescription);
    submissionData.append(
      "secondaryDescription",
      formData.secondaryDescription
    );
    submissionData.append("poinDivisi", JSON.stringify(formData.poinDivisi));
    for (const [key, value] of Object.entries(formData.images)) {
      if (value instanceof File) {
        submissionData.append(key, value);
      } else if (typeof value === "string" && value) {
        submissionData.append(`${key}_url`, value);
      }
    }

    setIsSubmit(true);
    try {
      const res = await fetch(
        `/dashboard/api/publikasi/divisi/${divisi}/edit`,
        {
          method: "PATCH",
          body: submissionData,
        }
      );
      const result = await res.json();
      if (!result.success) {
        dispatch(
          alertIsAktif({
            status: false,
            title: "",
            message: result.message,
          })
        );
      }
      dispatch(
        alertIsAktif({
          status: true,
          title: "Success! Your changes have been saved",
          message: result.message,
        })
      );

      router.push("/dashboard/publikasi/divisi");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: { message: string } | unknown) {
      dispatch(
        alertIsAktif({
          status: false,
          title: "",
          message: "An unknown error occurred. Please try again later.",
        })
      );
    }
    setIsSubmit(false);
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormMainInfo
            formData={formData}
            formStatus={formStatus}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <FormSecondaryInfo
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            formStatus={formStatus}
          />
        );
      case 2:
        return (
          <FormPoinDivisi
            formData={formData}
            handlePoinDivisiChange={handlePoinDivisiChange}
            nextStep={nextStep}
            prevStep={prevStep}
            formStatus={formStatus}
          />
        );
      case 3:
        return (
          <FormImages
            formData={formData}
            isSubmit={isSubmit}
            handleImageChange={handleImageChange}
            prevStep={prevStep}
            formStatus={formStatus}
          />
        );
      default:
        return (
          <FormMainInfo
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            formStatus={formStatus}
          />
        );
    }
  };

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Edit Publikasi Divisi
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Ubah konten halaman publik divisi Anda. Ikuti langkah-langkah untuk
          memastikan semua bagian terisi.
        </span>
        <div className="w-full sm:w-3/4 mt-4">
          <Image
            src="/assets/undraw/browsing.svg"
            height={5000}
            width={5000}
            alt="settings illustration"
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
            <p className="text-gray-500">Memuat data divisi...</p>
          </div>
        ) : (
          renderStep()
        )}
      </form>
    </DashboardSection>
  );
}

interface FormMainInfoProps {
  formData: DivisiSettingsFormData;
  formStatus: StatusForm;
  handleChange: (field: keyof DivisiSettingsFormData, value: string) => void;
  nextStep: () => void;
}
const FormMainInfo = ({
  formData,
  handleChange,
  nextStep,
  formStatus,
}: FormMainInfoProps) => {
  const isStepValid =
    !formStatus.mainTitle.status && !formStatus.mainDescription.status;
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Informasi Utama</h2>
      <p className="text-sm text-gray-500 mt-1">
        Ini adalah judul dan paragraf pertama yang akan dilihat pengunjung.
      </p>
      <div className="mt-8 flex flex-col gap-8">
        <InputText
          label="*Main Title"
          name="mainTitle"
          placeholder="Judul utama divisi"
          type="text"
          value={formData.mainTitle}
          onChange={(e) => handleChange("mainTitle", e.target.value)}
          isError={formStatus.mainTitle}
        />
        <InputTextArea
          label="Main Description"
          name="mainDescription"
          placeholder="Deskripsi utama divisi..."
          value={formData.mainDescription}
          onChange={(e) => handleChange("mainDescription", e.target.value)}
          rows={6}
          isError={formStatus.mainDescription}
        />
        <div className="w-full flex justify-end mt-6">
          <button
            type="button"
            disabled={!isStepValid}
            onClick={nextStep}
            className={`text-white font-semibold ${
              !isStepValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary cursor-pointer hover:bg-primary-dark"
            } rounded-lg px-4 py-2`}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};

// --- LANGKAH 2: KOMPONEN FORM INFORMASI TAMBAHAN ---
interface FormSecondaryInfoProps {
  formData: DivisiSettingsFormData;
  handleChange: (field: keyof DivisiSettingsFormData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  formStatus: StatusForm;
}
const FormSecondaryInfo = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
  formStatus,
}: FormSecondaryInfoProps) => {
  const isStepValid =
    !formStatus.secondaryTitle.status &&
    !formStatus.secondaryDescription.status;
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Informasi Tambahan
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Bagian ini akan muncul setelah informasi utama.
      </p>
      <div className="mt-8 flex flex-col gap-8">
        <InputText
          label="Secondary Title"
          name="secondaryTitle"
          placeholder="Sub-judul, contoh: 'Apa yang kami kerjakan?'"
          type="text"
          value={formData.secondaryTitle}
          onChange={(e) => handleChange("secondaryTitle", e.target.value)}
          isError={formStatus.secondaryTitle}
        />
        <InputTextArea
          label="Secondary Description"
          name="secondaryDescription"
          placeholder="Deskripsi pendukung..."
          value={formData.secondaryDescription}
          onChange={(e) => handleChange("secondaryDescription", e.target.value)}
          rows={4}
          isError={formStatus.secondaryDescription}
        />
        <div className="w-full flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-1 font-semibold text-gray-600 hover:text-black"
          >
            <IoIosArrowBack /> Kembali
          </button>
          <button
            type="button"
            disabled={!isStepValid}
            onClick={nextStep}
            className={`text-white font-semibold ${
              !isStepValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary cursor-pointer hover:bg-primary-dark"
            } rounded-lg px-4 py-2`}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};

// --- LANGKAH 3: KOMPONEN FORM POIN DIVISI ---
interface FormPoinDivisiProps {
  formData: DivisiSettingsFormData;
  handlePoinDivisiChange: (
    index: number,
    field: keyof PoinDivisi,
    value: string
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  formStatus: StatusForm;
}
const FormPoinDivisi = ({
  formData,
  handlePoinDivisiChange,
  nextStep,
  prevStep,
  formStatus,
}: FormPoinDivisiProps) => {
  const isStepValid =
    !formData.poinDivisi.some((poin, index) => {
      const key = `poin${index + 1}` as keyof typeof formStatus.poinDivisi;
      return (
        formStatus.poinDivisi[key].title.status ||
        formStatus.poinDivisi[key].description.status
      );
    }) &&
    formData.poinDivisi.every(
      (poin) => poin.title.trim() !== "" && poin.description.trim() !== ""
    );
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">
        Poin Keunggulan Divisi
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Tiga poin utama yang menjelaskan fokus atau keunggulan divisi.
      </p>
      <div className="mt-8 flex flex-col gap-6">
        {formData.poinDivisi.map((poin, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg flex flex-col gap-8 border-gray-300"
          >
            <h4 className="font-medium text-gray-800">Poin {index + 1}</h4>
            <InputText
              label="Judul Poin"
              name={`poin_title_${index}`}
              type="text"
              value={poin.title}
              onChange={(e) =>
                handlePoinDivisiChange(index, "title", e.target.value)
              }
              isError={
                formStatus.poinDivisi[
                  `poin${index + 1}` as keyof typeof formStatus.poinDivisi
                ].title
              }
            />

            <InputTextArea
              label="Deskripsi Poin"
              name={`poin_description_${index}`}
              value={poin.description}
              onChange={(e) =>
                handlePoinDivisiChange(index, "description", e.target.value)
              }
              rows={6}
              isError={
                formStatus.poinDivisi[
                  `poin${index + 1}` as keyof typeof formStatus.poinDivisi
                ].description
              }
            />
          </div>
        ))}
        <div className="w-full flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-1 font-semibold text-gray-600 hover:text-black"
          >
            <IoIosArrowBack /> Kembali
          </button>
          <button
            type="button"
            disabled={!isStepValid}
            onClick={nextStep}
            className={`text-white font-semibold ${
              !isStepValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary cursor-pointer hover:bg-primary-dark"
            } rounded-lg px-4 py-2`}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};

// --- LANGKAH 4: KOMPONEN FORM GAMBAR ---
interface FormImagesProps {
  formData: DivisiSettingsFormData;
  handleImageChange: (
    imageKey: keyof DivisiSettingsFormData["images"],
    file: File | null
  ) => void;
  prevStep: () => void;
  formStatus?: StatusForm;
  isSubmit?: boolean;
}
const FormImages = ({
  formData,
  handleImageChange,
  prevStep,
  formStatus,
  isSubmit,
}: FormImagesProps) => {
  const isStepValid = !Object.values(formStatus?.images || {}).some(
    (field) => field.status
  );
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Galeri Gambar</h2>
      <p className="text-sm text-gray-500 mt-1">
        Unggah hingga 5 gambar untuk galeri divisi.
      </p>
      <div className="mt-8 flex flex-col gap-8">
        {(
          Object.keys(formData.images) as Array<
            keyof DivisiSettingsFormData["images"]
          >
        )
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map((key, index) => (
            <InputFile
              key={key}
              label={`${key}`}
              name={key}
              value={formData.images[key]}
              onChange={(file) => handleImageChange(key, file)}
              isError={formStatus?.images[key]}
            />
          ))}
        <div className="w-full flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-1 font-semibold text-gray-600 hover:text-black"
          >
            <IoIosArrowBack /> Kembali
          </button>
          <button
            type="submit"
            disabled={!isStepValid || isSubmit}
            // onClick={nextStep}
            className={`text-white font-semibold ${
              !isStepValid || isSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary cursor-pointer hover:bg-primary-dark"
            } rounded-lg px-4 py-2`}
          >
            {isSubmit ? "Loading..." : isStepValid ? "Submit" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
