import { NextRequest, NextResponse } from "next/server";
import { getMemberPayments } from "@/lib/firebase/kasServices";

// GET - Get current user's kas data  
export async function GET(req: NextRequest) {
    try {
        // Get userId from query parameter (sent by client)
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID required" },
                { status: 400 }
            );
        }

        const result = await getMemberPayments(userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/keuangan/kas/saya:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
