"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardSection from "@/components/ui/templates/DashboardSection";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputFile from "@/components/ui/moleculs/input/InputFile";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import Image from "next/image";

export default function EditPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true); // Loading fetch data awal
  const [isSaving, setIsSaving] = useState(false); // Loading saat simpan

  // State Form (Foto bisa string URL atau File object)
  const [form, setForm] = useState({
    nomor_urut: "",
    tagline: "",
    visi: "",
    misi: "",
    program_kerja: "",
    ketua: {
      nama: "",
      nim: "",
      semester: "",
      foto: null as File | string | null,
    },
    wakil: {
      nama: "",
      nim: "",
      semester: "",
      foto: null as File | string | null,
    },
  });

  // 1. FETCH DATA LAMA SAAT MOUNT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/dashboard/api/pemilu/paslon?id=${params.id}`);
        const result = await res.json();

        if (result.success && result.data) {
          const data = result.data;

          // Isi form dengan data database
          setForm({
            nomor_urut: data.nomor_urut,
            tagline: data.tagline,
            visi: data.visi,
            misi: data.misi,
            program_kerja: data.program_kerja,
            ketua: {
              nama: data.ketua.nama,
              nim: data.ketua.nim,
              semester: data.ketua.semester,
              foto: data.ketua.foto, // Ini URL string dari DB
            },
            wakil: {
              nama: data.wakil.nama,
              nim: data.wakil.nim,
              semester: data.wakil.semester,
              foto: data.wakil.foto, // Ini URL string dari DB
            },
          });
        } else {
          throw new Error("Data tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetch:", error);
        dispatch(
          alertIsAktif({
            status: true,
            title: "Error",
            message: "Gagal mengambil data paslon",
          })
        );
        router.push("/dashboard/settings/pemilu/kandidat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, dispatch, router]);

  // 2. HANDLE SUBMIT (PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      // Penting: Kirim ID biar backend tau siapa yg diupdate
      formData.append("id", params.id as string);

      // Append Text Fields
      formData.append("nomor_urut", form.nomor_urut);
      formData.append("tagline", form.tagline);
      formData.append("visi", form.visi);
      formData.append("misi", form.misi);
      formData.append("program_kerja", form.program_kerja);

      // Append Ketua
      formData.append("ketua_nama", form.ketua.nama);
      formData.append("ketua_nim", form.ketua.nim);
      formData.append("ketua_semester", form.ketua.semester);

      // LOGIC IMAGE KETUA:
      // Cuma append kalo user upload file BARU (tipe datanya File Object)
      // Kalo masih string URL, gausah dikirim, backend pake URL lama
      if (form.ketua.foto instanceof File) {
        formData.append("foto_ketua", form.ketua.foto);
      }

      // Append Wakil
      formData.append("wakil_nama", form.wakil.nama);
      formData.append("wakil_nim", form.wakil.nim);
      formData.append("wakil_semester", form.wakil.semester);

      // LOGIC IMAGE WAKIL
      if (form.wakil.foto instanceof File) {
        formData.append("foto_wakil", form.wakil.foto);
      }

      // === FETCH KE API ROUTE PATCH ===
      // Pastikan endpoint ini support method PATCH sesuai yang kita bahas sebelumnya
      const response = await fetch("/dashboard/api/pemilu/paslon/edit", {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      dispatch(
        alertIsAktif({
          status: true,
          title: "Success",
          message: "Data paslon berhasil diperbarui",
        })
      );

      router.push("/dashboard/pemilu/kandidat");
      router.refresh(); // Refresh biar data di list update

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error update paslon:", error);
      dispatch(
        alertIsAktif({
          status: true,
          title: "Gagal",
          message: error.message || "Something went wrong",
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Memuat data paslon...</div>;
  }

  return (
    <DashboardSection className="max-w-5xl mx-auto space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-8"
      >
        {/* ================= SECTION 1 ================= */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold">Edit Informasi Pasangan Calon</h2>
            <span className="text-sm text-gray-500">ID: {params.id}</span>
          </div>

          <InputText
            name="nomor_urut"
            label="*Nomor Urut"
            type="number"
            placeholder="Contoh: 1"
            value={form.nomor_urut} // JANGAN LUPA VALUE
            onChange={(e) => setForm({ ...form, nomor_urut: e.target.value })}
          />

          <InputText
            name="tagline"
            type="text"
            label="*Tagline"
            placeholder="Contoh: Bersama Membangun Himpunan"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />

          <InputText
            name="visi"
            type="text"
            label="*Visi"
            placeholder="Visi pasangan calon"
            value={form.visi}
            onChange={(e) => setForm({ ...form, visi: e.target.value })}
          />
          <InputText
            name="misi"
            type="text"
            label="*Misi"
            placeholder="Misi pasangan calon"
            value={form.misi}
            onChange={(e) => setForm({ ...form, misi: e.target.value })}
          />

          <InputText
            name="program_kerja"
            type="text"
            label="*Program Kerja"
            placeholder="Program kerja unggulan"
            value={form.program_kerja}
            onChange={(e) =>
              setForm({ ...form, program_kerja: e.target.value })
            }
          />
        </div>

        {/* ================= SECTION 2 ================= */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Data Calon</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KETUA */}
            <div className="space-y-4">
              <h3 className="font-semibold bg-gray-50 p-2 rounded">Ketua</h3>

              {/* PREVIEW FOTO KETUA */}
              {typeof form.ketua.foto === "string" && (
                <div className="flex flex-col gap-2 mb-2">
                  <span className="text-xs text-gray-500">Foto Saat Ini:</span>
                  <Image
                    width={500}
                    height={500}
                    src={form.ketua.foto}
                    alt="Preview Ketua"
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                </div>
              )}

              <InputFile
                name="ketua.foto"
                label={
                  typeof form.ketua.foto === "string"
                    ? "Ganti Foto Ketua (Opsional)"
                    : "*Foto Ketua"
                }
                // Note: InputFile biasanya gak bisa nerima value string URL krn security browser
                // Jadi kita pass null atau undefined kalau isinya string, biar inputnya kosong
                value={form.ketua.foto}
                onChange={(file) =>
                  setForm({
                    ...form,
                    ketua: { ...form.ketua, foto: file },
                  })
                }
              />

              <InputText
                name="ketua.nama"
                type="text"
                label="*Nama Ketua"
                placeholder="Nama lengkap"
                value={form.ketua.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ketua: { ...form.ketua, nama: e.target.value },
                  })
                }
              />

              <InputText
                name="ketua.nim"
                type="text"
                label="*NIM Ketua"
                placeholder="NIM"
                value={form.ketua.nim}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ketua: { ...form.ketua, nim: e.target.value },
                  })
                }
              />

              <InputText
                name="ketua.semester"
                type="text"
                label="*Semester Ketua"
                placeholder="Contoh: 5"
                value={form.ketua.semester}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ketua: { ...form.ketua, semester: e.target.value },
                  })
                }
              />
            </div>

            {/* WAKIL */}
            <div className="space-y-4">
              <h3 className="font-semibold bg-gray-50 p-2 rounded">Wakil</h3>

              {/* PREVIEW FOTO WAKIL */}
              {typeof form.wakil.foto === "string" && (
                <div className="flex flex-col gap-2 mb-2">
                  <span className="text-xs text-gray-500">Foto Saat Ini:</span>
                  <Image
                    width={500}
                    height={500}
                    src={form.wakil.foto}
                    alt="Preview Wakil"
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                </div>
              )}

              <InputFile
                name="wakil.foto"
                label={
                  typeof form.wakil.foto === "string"
                    ? "Ganti Foto Wakil (Opsional)"
                    : "*Foto Wakil"
                }
                value={form.wakil.foto}
                onChange={(file) =>
                  setForm({
                    ...form,
                    wakil: { ...form.wakil, foto: file },
                  })
                }
              />

              <InputText
                name="wakil.nama"
                type="text"
                label="*Nama Wakil"
                placeholder="Nama lengkap"
                value={form.wakil.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    wakil: { ...form.wakil, nama: e.target.value },
                  })
                }
              />

              <InputText
                name="wakil.nim"
                type="text"
                label="*NIM Wakil"
                placeholder="NIM"
                value={form.wakil.nim}
                onChange={(e) =>
                  setForm({
                    ...form,
                    wakil: { ...form.wakil, nim: e.target.value },
                  })
                }
              />

              <InputText
                name="wakil.semester"
                type="text"
                label="*Semester Wakil"
                placeholder="Contoh: 5"
                value={form.wakil.semester}
                onChange={(e) =>
                  setForm({
                    ...form,
                    wakil: { ...form.wakil, semester: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            disabled={isSaving}
            type="submit"
            className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition ${isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSaving ? "Menyimpan Perubahan..." : "Update Paslon"}
          </button>
        </div>
      </form>
    </DashboardSection>
  );
}
