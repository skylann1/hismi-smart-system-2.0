import { NextResponse, NextRequest } from "next/server";
import { uploadImage, deleteImage } from "@/lib/supabase/services";
import { updateDivisiDesc, getDataByNama } from "@/lib/firebase/services";
import { DivisiSettingsType } from "@/types";

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.formData();

    // Ambil data lama dari Firestore
    const oldDivisiRes = await getDataByNama<DivisiSettingsType>("divisi", "bph");
    const oldImages = oldDivisiRes.success ? oldDivisiRes.data.images : undefined;

    // Ambil file baru dari formData
    const image1 = data.get("image1") as File | null;
    const image2 = data.get("image2") as File | null;
    const image3 = data.get("image3") as File | null;
    const image4 = data.get("image4") as File | null;
    // BPH might not have image5 form input, but type requires it.
    const image5 = data.get("image5") as File | null;

    // Siapin object hasil akhir (gabungan lama + baru)
    // Cast old images to string because we are storing URLs
    const updatedImages: Record<"image1" | "image2" | "image3" | "image4" | "image5", string | null> = {
      image1: typeof oldImages?.image1 === 'string' ? oldImages.image1 : null,
      image2: typeof oldImages?.image2 === 'string' ? oldImages.image2 : null,
      image3: typeof oldImages?.image3 === 'string' ? oldImages.image3 : null,
      image4: typeof oldImages?.image4 === 'string' ? oldImages.image4 : null,
      image5: typeof oldImages?.image5 === 'string' ? oldImages.image5 : null,
    };

    // Helper function upload + hapus lama
    const handleImageUpdate = async (
      key: keyof typeof updatedImages,
      newFile: File | null
    ) => {
      if (newFile) {
        // Hapus gambar lama kalau ada
        const oldUrl = oldImages?.[key];
        if (oldUrl && typeof oldUrl === 'string') {
          await deleteImage(oldUrl, "images");
        }
        // Upload gambar baru
        const { url } = await uploadImage(newFile, "divisi");
        updatedImages[key] = url ?? null;
      }
    };

    await Promise.all([
      handleImageUpdate("image1", image1),
      handleImageUpdate("image2", image2),
      handleImageUpdate("image3", image3),
      handleImageUpdate("image4", image4),
      handleImageUpdate("image5", image5),
    ]);

    // Update data di Firestore
    // Need to cast to satisfy the strict type if necessary, but matching shape should be enough
    const updateData: Partial<DivisiSettingsType> = { images: updatedImages };
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
