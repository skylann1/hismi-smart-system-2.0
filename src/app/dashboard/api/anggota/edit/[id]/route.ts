import { NextRequest, NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/supabase/services";
import { updateUser, getDataById } from "@/lib/firebase/services";
import getAccessByRoleAndDivisi from "@/lib/utils/accessMapping";
import { UserType } from "@/types";

function generatePasswordFromDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await req.formData();

    // ambil user lama (buat cek image lama)
    const oldUser = await getDataById<UserType>("users", id);

    const oldImageUrl = oldUser.success ? (oldUser.data?.imageUrl as string) : undefined;

    // --- handle image ---
    const imageField = data.get("imageUrl");
    let imageUrl: string | undefined = undefined;

    if (imageField && imageField instanceof File) {
      // kalau ada image baru, hapus image lama dulu
      if (oldImageUrl) {
        await deleteImage(oldImageUrl, "images"); // bucket "images"
      }

      const uploadRes = await uploadImage(imageField, "users");
      if (!uploadRes.success) {
        return NextResponse.json(
          { success: false, message: uploadRes.error },
          { status: 500 }
        );
      }
      imageUrl = uploadRes.url ?? "";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    const allowedFields = [
      "nama",
      "tipe_kelas",
      "email",
      "no_hp",
      "nim",
      "jenjang_pendidikan",
      "semester",
      "tahun_masuk",
      "divisi",
      "role",
      "tanggal_lahir",
    ];

    allowedFields.forEach((field) => {
      const value = data.get(field);
      if (value !== null && value !== "" && value !== "undefined") {
        updateData[field] =
          field === "semester" ? parseInt(value as string) : value;
      }
    });

    // tambahin image kalo ada upload
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    // generate access berdasarkan role + divisi
    if (updateData.role || updateData.divisi) {
      const role = updateData.role ?? data.get("role");
      const divisi = updateData.divisi ?? data.get("divisi");
      if (role && divisi) {
        updateData.access = getAccessByRoleAndDivisi(
          role as string,
          divisi as string
        ).map(String);
      }
    }

    // kalau tanggal lahir diubah, password ikut update
    if (updateData.tanggal_lahir) {
      updateData.password = generatePasswordFromDate(
        updateData.tanggal_lahir as string
      );
    }

    const update = await updateUser("users", id, updateData);

    if (!update.success) {
      return NextResponse.json(
        { success: false, message: update.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User updated successfully", data: updateData },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "error" },
      { status: 500 }
    );
  }
}
