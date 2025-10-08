import { NextResponse, NextRequest } from "next/server";
import { uploadImage, deleteImage } from "@/lib/supabase/services";
import { updateDivisiDesc, getDataByNama } from "@/lib/firebase/services";
import type { DivisiSettingsType } from "@/types";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ divisi: string }> }
) {
    try {
        const formData = await req.formData();
        const { divisi } = await context.params;

        const oldDivisiRes = await getDataByNama("divisi", divisi);
        const oldImages = oldDivisiRes.success
            ? (oldDivisiRes.data?.images as Record<string, string | null> | undefined)
            : undefined;

        const updateData: Partial<DivisiSettingsType> = {};

        const mainTitle = formData.get("mainTitle") as string | null;
        if (mainTitle) updateData.mainTitle = mainTitle;

        const secondaryTitle = formData.get("secondaryTitle") as string | null;
        if (secondaryTitle) updateData.secondaryTitle = secondaryTitle;

        const mainDescription = formData.get("mainDescription") as string | null;
        if (mainDescription) updateData.mainDescription = mainDescription;

        const secondaryDescription = formData.get("secondaryDescription") as string | null;
        if (secondaryDescription) updateData.secondaryDescription = secondaryDescription;

        const poinDivisi = formData.get("poinDivisi") as string | null;
        if (poinDivisi) {
            try {
                updateData.poinDivisi = JSON.parse(poinDivisi);
            } catch (err) {
                console.error("Invalid poinDivisi JSON:", err);
            }
        }

        const images: Record<`image${1 | 2 | 3 | 4 | 5}`, string | null> = {
            image1: oldImages?.image1 ?? null,
            image2: oldImages?.image2 ?? null,
            image3: oldImages?.image3 ?? null,
            image4: oldImages?.image4 ?? null,
            image5: oldImages?.image5 ?? null,
        };

        for (let i = 1; i <= 5; i++) {
            const key = `image${i}` as keyof typeof images;
            const file = formData.get(key) as File | null;

            if (file && file instanceof File) {
                const oldUrl = images[key];
                if (oldUrl) {
                    await deleteImage(oldUrl, "images");
                }

                const uploadRes = await uploadImage(file, "divisi");
                if (uploadRes.success) {
                    images[key] = uploadRes.url;
                }
            }
        }

        updateData.images = images;


        if (Object.values(images).some((v) => v !== null)) {
            updateData.images = images;
        }

        const tryToUpdate = await updateDivisiDesc("divisi", divisi, updateData);

        if (!tryToUpdate.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to update divisi",
                    error: tryToUpdate.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Divisi updated successfully",
                data: updateData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH /divisi error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update divisi",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
