import { NextRequest, NextResponse } from "next/server";
import { deletePertemuan } from "@/lib/firebase/services";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const result = await deletePertemuan(id);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Pertemuan berhasil dihapus" });
    } catch (error) {
        console.error("Delete pertemuan error:", error);
        return NextResponse.json({ success: false, message: "Gagal menghapus pertemuan" }, { status: 500 });
    }
}
