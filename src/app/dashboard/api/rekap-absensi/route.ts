import { NextResponse, NextRequest } from "next/server";
import { getAllAbsenByAnggotaIdWithUser } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const result = await getAllAbsenByAnggotaIdWithUser(userId);

    if (result.success) {
        return NextResponse.json({ success: true, data: result.data });
    } else {
        // Kalo error atau gaada data, return array kosong gapapa biar ga error di frontend
        return NextResponse.json({ success: true, data: [] });
    }
}
