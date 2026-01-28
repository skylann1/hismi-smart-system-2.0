import { NextRequest, NextResponse } from "next/server";
import { getFinancialSummary } from "@/lib/firebase/financialServices";

// GET - Fetch financial summary
export async function GET(req: NextRequest) {
    try {
        const result = await getFinancialSummary();

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/keuangan/summary:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
