import { NextRequest, NextResponse } from "next/server";
import {
    getAllPayments,
    updatePaymentStatus,
} from "@/lib/firebase/financialServices";

// GET - Fetch all payments (with optional status filter)
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;

        const result = await getAllPayments(status || undefined);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/keuangan/persetujuan:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// PATCH - Update payment status (approve/reject)
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const { paymentId, status, keterangan } = body;

        // Validation
        if (!paymentId || !status) {
            return NextResponse.json(
                { success: false, message: "Payment ID and status are required" },
                { status: 400 }
            );
        }

        if (status !== "approved" && status !== "rejected") {
            return NextResponse.json(
                { success: false, message: "Status must be 'approved' or 'rejected'" },
                { status: 400 }
            );
        }

        const result = await updatePaymentStatus(paymentId, status, keterangan);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in PATCH /api/keuangan/persetujuan:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
