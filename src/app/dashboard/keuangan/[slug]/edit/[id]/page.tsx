"use client";

import DashboardSection from "@/components/ui/templates/DashboardSection";
import Image from "next/image";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputDate from "@/components/ui/moleculs/input/InputDate";
import RadioButtonGroup from "@/components/ui/moleculs/input/RadioButtonGroup";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface TransaksiFormData {
  judul: string;
  deskripsi: string;
  jumlah: number | string;
  tanggal: string;
  tipe: "rutin" | "tidak";
  kategori: string;
}

export default function Edit() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;
  const slug = params.slug as string;

  const [formType, setFormType] = useState<"pemasukan" | "pengeluaran">(
    slug as "pemasukan" | "pengeluaran" || "pengeluaran"
  );

  const [formData, setFormData] = useState<TransaksiFormData>({
    judul: "",
    deskripsi: "",
    jumlah: "",
    tanggal: "",
    tipe: "tidak",
    kategori: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    judul: { status: false, message: "" },
    jumlah: { status: false, message: "" },
    tanggal: { status: false, message: "" },
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch transaction data on mount
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/dashboard/api/keuangan/transaksi/${transactionId}`);
        const result = await response.json();

        if (result.success) {
          const data = result.data;
          setFormData({
            judul: data.judul,
            deskripsi: data.deskripsi || "",
            jumlah: data.jumlah,
            tanggal: data.tanggal,
            tipe: "tidak",
            kategori: data.kategori,
          });
          setFormType(data.tipe);
        } else {
          alert("Gagal memuat data transaksi");
          router.back();
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId, router]);

  const validateField = (field: string, value: string | number) => {
    let error = { status: false, message: "" };

    switch (field) {
      case "judul":
        if (typeof value === "string" && !value.trim()) {
          error = { status: true, message: "Judul wajib diisi" };
        }
        break;
      case "jumlah":
        if (!value) {
          error = { status: true, message: "Jumlah wajib diisi" };
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = { status: true, message: "Jumlah harus angka positif" };
        }
        break;
      case "tanggal":
        if (!value) {
          error = { status: true, message: "Tanggal wajib diisi" };
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const jenisTransaksiOptions = [
    { value: "pengeluaran", label: "Pengeluaran" },
    { value: "pemasukan", label: "Pemasukan" },
  ];

  useEffect(() => {
    const isErrorPresent = Object.values(errors).some(error => error.status);
    const isDataMissing = !formData.judul || !formData.jumlah || !formData.tanggal || !formData.kategori;
    setIsFormValid(!isDataMissing && !isErrorPresent);
  }, [formData, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/dashboard/api/keuangan/transaksi/${transactionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: formData.judul,
          deskripsi: formData.deskripsi,
          jumlah: Number(formData.jumlah),
          tanggal: formData.tanggal,
          kategori: formData.kategori,
          tipe: formType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Transaksi berhasil diupdate!");
        router.push("/dashboard/keuangan/riwayat");
      } else {
        alert(result.message || "Gagal update transaksi");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardSection className="w-full min-h-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-6">
      <div className="flex flex-col gap-4 items-center lg:items-start text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Edit Transaksi Keuangan
        </h2>
        <span className="text-sm font-[400] text-gray-500 leading-relaxed">
          Update data transaksi pemasukan atau pengeluaran kas HIMSI.
        </span>
        <div className="w-full sm:w-3/4 mt-4">
          <Image
            src="/assets/undraw/printing-invoices.svg"
            height={5000}
            width={5000}
            alt="finance illustration"
            className="w-full max-w-sm mx-auto lg:mx-0 object-center object-cover"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col gap-3 mb-8">
          <label className="text-sm font-medium text-gray-700">
            *Pilih Jenis Transaksi
          </label>
          <RadioButtonGroup
            className="grid grid-cols-2 gap-2"
            options={jenisTransaksiOptions}
            name="jenis_transaksi"
            value={formType}
            onChange={(value) => setFormType(value as "pemasukan" | "pengeluaran")}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          Form {formType}
        </h2>

        <div className="mt-8 flex flex-col gap-8">
          <InputText
            label="*Judul Transaksi"
            placeholder="Contoh: Beli spanduk acara"
            name="judul"
            type="text"
            value={formData.judul}
            onChange={(e) => handleChange("judul", e.target.value)}
            isError={errors.judul}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              placeholder="Deskripsi transaksi..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <InputText
            label="*Jumlah (Rp)"
            placeholder="Contoh: 50000"
            name="jumlah"
            type="number"
            value={String(formData.jumlah)}
            onChange={(e) => handleChange("jumlah", e.target.value)}
            isError={errors.jumlah}
          />
          <InputDate
            onChange={(e) => handleChange("tanggal", e)}
            value={formData.tanggal}
            isError={errors.tanggal}
          />
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">*Kategori</label>
            <input
              type="text"
              value={formData.kategori}
              onChange={(e) => handleChange("kategori", e.target.value)}
              placeholder="Contoh: Kas Anggota, Konsumsi, Transport"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="w-full flex gap-3 pb-1 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`flex-1 text-white ${!isFormValid || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer hover:bg-primary-dark"
                } rounded-lg px-4 py-2 font-semibold`}
            >
              {isSubmitting ? "Updating..." : "Update Transaksi"}
            </button>
          </div>
        </div>
      </form>
    </DashboardSection>
  );
}