import { NextResponse, NextRequest } from "next/server";
import { addBlog } from "@/lib/firebase/services";
import { uploadImage } from "@/lib/supabase/services";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        console.log("form data is", formData);

        const cover = formData.get("cover") as File | null;
        const images = (formData.getAll("gambar_tambahan") as File[]) ?? [];
        const judul = formData.get("judul") as string;
        const tanggal = formData.get("tanggal") as string;
        const status = formData.get("status") as string;
        const author = formData.get("author") as string;
        const kategori = formData.get("kategori") as string;
        const paragraf = JSON.parse(formData.get("paragraf") as string);

        let coverUrl = ""
        if (cover instanceof File) {
            const uploadRes = await uploadImage(cover, "blog");
            if (!uploadRes.success) {
                throw new Error(uploadRes.error);
            }
            coverUrl = uploadRes.url ?? "";
        }


        const imagesUrl: { gambar1?: string; gambar2?: string } = {};
        if (images && images.length > 0) {
            for (const [index, img] of images.entries()) {
                const uploadRes = await uploadImage(img, "blog");

                if (!uploadRes.success) {
                    throw new Error(uploadRes.error);
                }

                if (uploadRes.url) {
                    if (index === 0) imagesUrl.gambar1 = uploadRes.url;
                    if (index === 1) imagesUrl.gambar2 = uploadRes.url;
                }
            }
        }

        await new Promise<void>((resolve, reject) => {
            addBlog({
                judul,
                author,
                status,
                tanggal,
                kategori,
                paragraf,
                cover: coverUrl,
                gambar_tambahan: {
                    gambar1: imagesUrl.gambar1 ?? "",
                    gambar2: imagesUrl.gambar2 ?? "",
                },
            }, (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(new Error(result.message));
                }
            })
        })

        return NextResponse.json({ success: true, message: "Form data successfully added!" }, { status: 200 });
    } catch (err) {
        console.error("Error in blog upload:", err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
