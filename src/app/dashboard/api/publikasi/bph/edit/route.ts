import { NextResponse, NextRequest } from "next/server";
import { uploadImage, deleteImage } from "@/lib/supabase/services";
import { updateDivisiDesc, getDataByNama } from "@/lib/firebase/services";

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.formData();

    // Ambil data lama dari Firestore
    const oldDivisiRes = await getDataByNama("divisi", "bph");
    const oldImages = oldDivisiRes.success
      ? (oldDivisiRes.data?.images as Record<string, string | null> | undefined)
      : undefined;

    // Ambil file baru dari formData
    const image1 = data.get("image1") as File | null;
    const image2 = data.get("image2") as File | null;
    const image3 = data.get("image3") as File | null;
    const image4 = data.get("image4") as File | null;

    // Siapin object hasil akhir (gabungan lama + baru)
    const updatedImages: Record<string, string | null> = {
      image1: oldImages?.image1 || null,
      image2: oldImages?.image2 || null,
      image3: oldImages?.image3 || null,
      image4: oldImages?.image4 || null,
    };

    // Helper function upload + hapus lama
    const handleImageUpdate = async (
      key: keyof typeof updatedImages,
      newFile: File | null
    ) => {
      if (newFile) {
        // Hapus gambar lama kalau ada
        if (oldImages?.[key]) {
          await deleteImage(oldImages[key] as string, "images");
        }
        // Upload gambar baru
        const { url } = await uploadImage(newFile, "divisi");
        updatedImages[key] = url;
      }
    };

    await Promise.all([
      handleImageUpdate("image1", image1),
      handleImageUpdate("image2", image2),
      handleImageUpdate("image3", image3),
      handleImageUpdate("image4", image4),
    ]);

    // Update data di Firestore
    const updateData = { images: updatedImages };
    await updateDivisiDesc("divisi", "bph", updateData);

    return NextResponse.json({
      success: true,
      message: "Images updated successfully",
      data: updatedImages,
    });
  } catch (err) {
    console.error("Error updating images:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update images" },
      { status: 500 }
    );
  }
}
