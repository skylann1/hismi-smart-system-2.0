import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/supabase/services";
import { addAnggota } from "@/lib/firebase/services";
import getAccessByRoleAndDivisi from "@/lib/utils/accessMapping";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    let publicUrl = "";
    if (file) {
      const uploadRes = await uploadImage(file, "users");
      if (!uploadRes.success) {
        throw new Error(uploadRes.error);
      }
      publicUrl = uploadRes.url ?? "";
    }
    const nama = formData.get("nama") as string;
    const tanggal_lahir = formData.get("tanggal_lahir") as string;
    const email = formData.get("email") as string;
    const no_hp = formData.get("no_hp") as string;
    const nim = formData.get("nim") as string;
    const jenjang_pendidikan = formData.get(
        "jenjang_pendidikan"
    ) as string;
    const semester = parseInt(formData.get("semester") as string);
    const tipe_kelas = formData.get("tipe_kelas") as string;
    const tahun_masuk = formData.get("tahun_masuk") as string;
    const divisi = formData.get("divisi") as string;
    const role = formData.get("role") as string;
    const access = getAccessByRoleAndDivisi(role, divisi).map(String);

    await new Promise<void>((resolve, reject) => {
      addAnggota(
        {
          nama,
          tanggal_lahir,
          email,
          no_hp,
          nim,
          jenjang_pendidikan,
          semester,
          tipe_kelas,
          tahun_masuk,
          divisi,
          role,
          imageUrl: publicUrl,
          access,
        },
        (result) => {
          if (result.success) {
            resolve();
          } else {
            reject(new Error(result.message));
          }
        }
      );
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil di tambahkan.",
    });
  } catch (err: unknown) {
    console.error("Error:", err);
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
