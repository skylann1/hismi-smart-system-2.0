import { NextResponse, NextRequest } from "next/server";
import { updateProker } from "@/lib/firebase/services";

export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.json();
        const id = formData.id;
 
        const dataToUpdate = { ...formData };
        delete dataToUpdate.id;
        const res = await updateProker(dataToUpdate, id);

        if (!res.ok) {
            return NextResponse.json({ success: false, message: res.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Yes, data udah berhasil di update nih" })
    } catch (error) {
        return NextResponse.json({ ok: false, message: "Gagal memperbarui pertemuan", error }, { status: 500 });
    }
}