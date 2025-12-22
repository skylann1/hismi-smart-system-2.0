import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/supabase/services"; // Pake service supabase lu
import { addPaslon } from "@/lib/firebase/services";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. AMBIL FILE GAMBAR DARI FORM DATA
    const fileKetua = formData.get("foto_ketua") as File | null;
    const fileWakil = formData.get("foto_wakil") as File | null;

    let urlKetua = "";
    let urlWakil = "";

    // 2. UPLOAD FOTO KETUA (Kalo ada)
    if (fileKetua && fileKetua.size > 0) {
      const resKetua = await uploadImage(fileKetua, "paslon-ketua"); // Folder 'paslon-ketua'
      if (!resKetua.success) throw new Error("Gagal upload foto ketua: " + resKetua.error);
      urlKetua = resKetua.url ?? "";
    }

    // 3. UPLOAD FOTO WAKIL (Kalo ada)
    if (fileWakil && fileWakil.size > 0) {
      const resWakil = await uploadImage(fileWakil, "paslon-wakil"); // Folder 'paslon-wakil'
      if (!resWakil.success) throw new Error("Gagal upload foto wakil: " + resWakil.error);
      urlWakil = resWakil.url ?? "";
    }

    // 4. SUSUN DATA OBJECT
    // Kita construct ulang objectnya dari flat form data
    const paslonData = {
      nomor_urut: Number(formData.get("nomor_urut")),
      tagline: formData.get("tagline") as string,
      visi: formData.get("visi") as string,
      misi: formData.get("misi") as string,
      program_kerja: formData.get("program_kerja") as string,
      ketua: {
        nama: formData.get("ketua_nama") as string,
        nim: formData.get("ketua_nim") as string,
        semester: formData.get("ketua_semester") as string,
        foto: urlKetua,
      },
      wakil: {
        nama: formData.get("wakil_nama") as string,
        nim: formData.get("wakil_nim") as string,
        semester: formData.get("wakil_semester") as string,
        foto: urlWakil,
      },
      createdAt: new Date(),
    };

    // 5. SIMPAN KE FIREBASE
    const result = await addPaslon(paslonData);

    if (!result.success) {
      throw new Error(result.message);
    }

    return NextResponse.json({
      success: true,
      message: "Paslon berhasil ditambahkan.",
    });

  } catch (err: unknown) {
    console.error("API Error:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}