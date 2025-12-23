import { updatePaslon, getPaslonById } from "@/lib/firebase/services";
import { uploadImage, deleteImage } from "@/lib/supabase/services";
import { NextRequest, NextResponse } from "next/server";

// ... imports lainnya

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string; // Kita kirim ID lewat FormData

    if (!id) throw new Error("ID tidak ditemukan");

    // 1. Ambil Data Lama (PENTING: Buat tau URL foto lama kalo mau dihapus)
    const oldDataRes = await getPaslonById(id);
    if (!oldDataRes.success || !oldDataRes.data) throw new Error("Data lama tidak ditemukan");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const oldData = oldDataRes.data as any;

    // 2. Setup Variable URL (Default pake yang lama)
    let urlKetua = oldData.ketua.foto;
    let urlWakil = oldData.wakil.foto;

    // 3. LOGIC FOTO KETUA
    const fileKetua = formData.get("foto_ketua") as File | null;
    if (fileKetua && fileKetua.size > 0) {
      // User upload baru:
      // A. Hapus foto lama di Supabase (Bersih-bersih)
      if (urlKetua) await deleteImage(urlKetua, "images");

      // B. Upload foto baru
      const upKetua = await uploadImage(fileKetua, "paslon-ketua");
      if (!upKetua.success) throw new Error("Gagal upload foto ketua baru");

      // C. Update URL
      urlKetua = upKetua.url;
    }

    // 4. LOGIC FOTO WAKIL
    const fileWakil = formData.get("foto_wakil") as File | null;
    if (fileWakil && fileWakil.size > 0) {
      // Sama kayak ketua logic-nya
      if (urlWakil) await deleteImage(urlWakil, "images");
      const upWakil = await uploadImage(fileWakil, "paslon-wakil");
      if (!upWakil.success) throw new Error("Gagal upload foto wakil baru");
      urlWakil = upWakil.url;
    }

    // 5. Susun Data Update
    const updateData = {
      nomor_urut: Number(formData.get("nomor_urut")),
      tagline: formData.get("tagline") as string,
      visi: formData.get("visi") as string,
      misi: formData.get("misi") as string,
      program_kerja: formData.get("program_kerja") as string,
      ketua: {
        nama: formData.get("ketua_nama") as string,
        nim: formData.get("ketua_nim") as string,
        semester: formData.get("ketua_semester") as string,
        foto: urlKetua, // Pake URL baru atau lama
      },
      wakil: {
        nama: formData.get("wakil_nama") as string,
        nim: formData.get("wakil_nim") as string,
        semester: formData.get("wakil_semester") as string,
        foto: urlWakil, // Pake URL baru atau lama
      },
    };

    // 6. Eksekusi Update ke Firestore
    const result = await updatePaslon(id, updateData);

    if (!result.success) throw new Error(result.message);

    return NextResponse.json({ success: true, message: "Data berhasil diperbarui" });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal update";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}