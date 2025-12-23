import { NextRequest, NextResponse } from "next/server";
import { getPaslonById, deletePaslon } from "@/lib/firebase/services";
import { deleteImage } from "@/lib/supabase/services"; // Import fungsi delete image lu yang di part 3

// ... import lainnya

export async function DELETE(req: NextRequest) {
  try {
    // 1. Ambil ID dari URL (contoh: /api/paslon?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    // 2. Cek datanya dulu (Kita butuh URL fotonya)
    const existing = await getPaslonById(id);
    if (!existing.success || !existing.data) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = existing.data as any;

    // 3. Hapus Foto Ketua di Supabase (Kalau ada)
    // Asumsi: data.ketua.foto menyimpan Full URL
    if (data.ketua?.foto) {
      await deleteImage(data.ketua.foto, "images"); // "images" adalah nama bucket lu
    }

    // 4. Hapus Foto Wakil di Supabase (Kalau ada)
    if (data.wakil?.foto) {
      await deleteImage(data.wakil.foto, "images");
    }

    // 5. Hapus Data di Firestore
    const delRes = await deletePaslon(id);
    if (!delRes.success) {
      throw new Error(delRes.message);
    }

    return NextResponse.json({ success: true, message: "Paslon berhasil dihapus permanen" });

  } catch (err: unknown) {
    console.error("Delete Error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}