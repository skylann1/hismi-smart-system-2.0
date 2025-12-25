import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/firebase/services";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const result = await deleteUser(id);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Anggota berhasil dihapus" });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ success: false, message: "Gagal menghapus anggota" }, { status: 500 });
    }
}
