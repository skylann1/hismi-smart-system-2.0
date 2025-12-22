import { NextResponse } from "next/server";
import { getPemiluConfig, getRealCountResults } from "@/lib/firebase/services";

export async function GET() {
    // 1. Cek Config
    const configRes = await getPemiluConfig();
    const isPublished = configRes.data?.isResultPublished;

    // Kalau settingan OFF, balikin status khusus
    if (!isPublished) {
        return NextResponse.json({
            success: true,
            isPublished: false,
            message: "Hasil belum dipublikasikan"
        });
    }

    // 2. Kalau ON, baru hitung suara
    const result = await getRealCountResults();

    return NextResponse.json({
        ...result, 
        success: true,
        isPublished: true
    });
}