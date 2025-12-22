"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSection from "@/components/ui/templates/DashboardSection";
import InputText from "@/components/ui/moleculs/input/InputText";
import InputFile from "@/components/ui/moleculs/input/InputFile";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
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
      foto: null as File | null,
    },
    wakil: {
      nama: "",
      nim: "",
      semester: "",
      foto: null as File | null,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      // Append field biasa
      formData.append("nomor_urut", form.nomor_urut);
      formData.append("tagline", form.tagline);
      formData.append("visi", form.visi);
      formData.append("misi", form.misi);
      formData.append("program_kerja", form.program_kerja);

      // Append data KETUA
      formData.append("ketua_nama", form.ketua.nama);
      formData.append("ketua_nim", form.ketua.nim);
      formData.append("ketua_semester", form.ketua.semester);
      // Append File cuma kalo user pilih file
      if (form.ketua.foto) formData.append("foto_ketua", form.ketua.foto);

      // Append data WAKIL
      formData.append("wakil_nama", form.wakil.nama);
      formData.append("wakil_nim", form.wakil.nim);
      formData.append("wakil_semester", form.wakil.semester);
      if (form.wakil.foto) formData.append("foto_wakil", form.wakil.foto);

      // === FETCH KE API ROUTE ===
      const response = await fetch("/dashboard/api/pemilu/paslon/tambah", {
        method: "POST",
        body: formData, // Browser otomatis set Content-Type: multipart/form-data
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      dispatch(
        alertIsAktif({
          status: true,
          title: "Success",
          message: result.message,
        })
      );
      router.push("/dashboard/pemilu/kandidat");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submit paslon:", error);
      dispatch(
        alertIsAktif({
          status: true,
          title: "Gagal bro",
          message: error.message || "Something went wrong",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DashboardSection className="max-w-5xl mx-auto space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-8"
      >
        {/* ================= SECTION 1 ================= */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Informasi Pasangan Calon</h2>

          <InputText
            name="nomor_urut"
            label="*Nomor Urut"
            type="number"
            placeholder="Contoh: 1"
            onChange={(e) => setForm({ ...form, nomor_urut: e.target.value })}
          />

          <InputText
            name="tagline"
            type="text"
            label="*Tagline"
            placeholder="Contoh: Bersama Membangun Himpunan"
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />

          <InputText
            name="visi"
            type="text"
            label="*Visi"
            placeholder="Visi pasangan calon"
            onChange={(e) => setForm({ ...form, visi: e.target.value })}
          />
          <InputText
            name="misi"
            type="text"
            label="*Misi"
            placeholder="Misi pasangan calon"
            onChange={(e) => setForm({ ...form, misi: e.target.value })}
          />

          <InputText
            name="program_kerja"
            type="text"
            label="*Program Kerja"
            placeholder="Program kerja unggulan"
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
              <h3 className="font-semibold">Ketua</h3>

              <InputFile
                name="ketua.foto"
                label="*Foto Ketua"
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    ketua: {
                      ...form.ketua,
                      nama: e.target.value,
                    },
                  })
                }
              />

              <InputText
                name="ketua.nim"
                type="text"
                label="*NIM Ketua"
                placeholder="NIM"
                onChange={(e) =>
                  setForm({
                    ...form,
                    ketua: {
                      ...form.ketua,
                      nim: e.target.value,
                    },
                  })
                }
              />

              <InputText
                name="ketua.semester"
                type="text"
                label="*Semester Ketua"
                placeholder="Contoh: 5"
                onChange={(e) =>
                  setForm({
                    ...form,
                    ketua: {
                      ...form.ketua,
                      semester: e.target.value,
                    },
                  })
                }
              />
            </div>

            {/* WAKIL */}
            <div className="space-y-4">
              <h3 className="font-semibold">Wakil</h3>

              <InputFile
                name="wakil.foto"
                label="*Foto Wakil"
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    wakil: {
                      ...form.wakil,
                      nama: e.target.value,
                    },
                  })
                }
              />

              <InputText
                name="wakil.nim"
                type="text"
                label="*NIM Wakil"
                placeholder="NIM"
                onChange={(e) =>
                  setForm({
                    ...form,
                    wakil: {
                      ...form.wakil,
                      nim: e.target.value,
                    },
                  })
                }
              />

              <InputText
                name="wakil.semester"
                type="text"
                label="*Semester Wakil"
                placeholder="Contoh: 5"
                onChange={(e) =>
                  setForm({
                    ...form,
                    wakil: {
                      ...form.wakil,
                      semester: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className={`bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Simpan Paslon
          </button>
        </div>
      </form>
    </DashboardSection>
  );
}
