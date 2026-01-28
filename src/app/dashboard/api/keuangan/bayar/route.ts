import { NextRequest, NextResponse } from "next/server";
import {
    submitPayment,
    getPaymentsByUser,
} from "@/lib/firebase/financialServices";

// GET - Fetch user's payment history
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const result = await getPaymentsByUser(userId);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/keuangan/bayar:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// POST - Submit new payment
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            userId,
            nama,
            nim,
            divisi,
            bulan,
            tahun,
            jumlah,
            buktiUrl,
            namaPengirim,
            tanggalTransfer,
        } = body;

        // Validation
        if (
            !userId ||
            !nama ||
            !nim ||
            !divisi ||
            !bulan ||
            !tahun ||
            !jumlah ||
            !buktiUrl ||
            !namaPengirim ||
            !tanggalTransfer
        ) {
            return NextResponse.json(
                { success: false, message: "Semua field wajib diisi" },
                { status: 400 }
            );
        }

        const result = await submitPayment({
            userId,
            nama,
            nim,
            divisi,
            bulan,
            tahun,
            jumlah,
            buktiUrl,
            namaPengirim,
            tanggalTransfer,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST /api/keuangan/bayar:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
