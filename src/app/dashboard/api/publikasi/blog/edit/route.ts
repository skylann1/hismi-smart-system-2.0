/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { updateBlog, getDataById } from "@/lib/firebase/services";
import { uploadImage, deleteImage } from "@/lib/supabase/services";

export async function PATCH(req: NextRequest) {
    try {
        const data = await req.formData();
        const id = data.get("id") as string;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing blog ID" },
                { status: 400 }
            );
        }

        const oldblog = await getDataById("blog", id);
        const oldData = oldblog.success ? (oldblog.data as any) : null;

        const oldCoverUrl = oldData?.cover;
        const oldGambarTambahan = oldData?.gambar_tambahan ?? {
            gambar1: "",
            gambar2: "",
        };

        let coverUrl: string = oldCoverUrl || "";
        const coverField = data.get("cover");

        if (coverField instanceof File) {
            if (oldCoverUrl as string) {
                await deleteImage(oldCoverUrl, "images");
            }

            const uploadRes = await uploadImage(coverField, "blog");
            if (!uploadRes.success)
                throw new Error(uploadRes.error || "Failed to upload cover image");

            coverUrl = uploadRes.url ?? "";
        }


        const gambarTambahan: { gambar1?: string; gambar2?: string } = {
            gambar1: oldGambarTambahan?.gambar1 || "",
            gambar2: oldGambarTambahan?.gambar2 || "",
        };

        const gambarTambahanFields = data.getAll("gambar_tambahan");

        for (const [index, field] of gambarTambahanFields.entries()) {
            if (field instanceof File) {
                const oldUrl =
                    index === 0 ? gambarTambahan.gambar1 : gambarTambahan.gambar2;
                if (oldUrl) await deleteImage(oldUrl, "images");

                const uploadRes = await uploadImage(field, "blog");
                if (!uploadRes.success)
                    throw new Error(uploadRes.error || "Failed to upload image");

                if (uploadRes.url) {
                    if (index === 0) gambarTambahan.gambar1 = uploadRes.url;
                    if (index === 1) gambarTambahan.gambar2 = uploadRes.url;
                }
            } else if (typeof field === "string" && field.trim() !== "") {
                // kalau masih string (URL lama), tetap dipakai
                if (index === 0) gambarTambahan.gambar1 = field;
                if (index === 1) gambarTambahan.gambar2 = field;
            }
        }

        // ====== HANDLE FIELD LAIN ======
        const allowedFields = ["judul", "kategori", "author", "tanggal", "status"];
        const updateData: Record<string, any> = {};

        allowedFields.forEach((field) => {
            const value = data.get(field);
            if (value !== null && value !== "" && value !== "undefined") {
                updateData[field] = value;
            }
        });

        if (coverUrl) updateData.cover = coverUrl;
        updateData.gambar_tambahan = gambarTambahan;

        // ====== HANDLE PARAGRAF ======
        const paragrafRaw = data.get("paragraf");
        if (paragrafRaw) {
            try {
                const parsed = JSON.parse(paragrafRaw as string);
                if (Array.isArray(parsed)) {
                    updateData.paragraf = parsed;
                }
            } catch {
                console.warn("Invalid paragraf JSON, skipping...");
            }
        }

        // ====== UPDATE FIRESTORE ======
        const updateRes = await updateBlog(id, updateData);
        if (!updateRes.ok) {
            return NextResponse.json(
                { success: false, message: updateRes.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Blog updated successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error updating blog:", err);
        return NextResponse.json(
            { success: false, message: (err as Error).message },
            { status: 500 }
        );
    }
}
