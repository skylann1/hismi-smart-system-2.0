import { NextRequest, NextResponse } from "next/server";
import { getAllMembersKasSummary } from "@/lib/firebase/kasServices";

// GET - Get all members kas summary
export async function GET(req: NextRequest) {
    try {
        const result = await getAllMembersKasSummary();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/keuangan/kas/anggota:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
