import { NextRequest, NextResponse } from "next/server";
import {
    addTransaction,
    getTransactions,
} from "@/lib/firebase/financialServices";

// GET - Fetch all transactions (with optional type filter)
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const tipe = searchParams.get("tipe") as "pemasukan" | "pengeluaran" | null;

        const result = await getTransactions(tipe || undefined);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/keuangan/transaksi:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// POST - Add new transaction
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            tipe,
            judul,
            deskripsi,
            jumlah,
            tanggal,
            kategori,
            buktiUrl,
            createdBy,
            createdByName,
        } = body;

        // Validation
        if (
            !tipe ||
            !judul ||
            !deskripsi ||
            !jumlah ||
            !tanggal ||
            !kategori ||
            !createdBy ||
            !createdByName
        ) {
            return NextResponse.json(
                { success: false, message: "Semua field wajib diisi kecuali bukti" },
                { status: 400 }
            );
        }

        if (tipe !== "pemasukan" && tipe !== "pengeluaran") {
            return NextResponse.json(
                { success: false, message: "Tipe must be 'pemasukan' or 'pengeluaran'" },
                { status: 400 }
            );
        }

        const result = await addTransaction({
            tipe,
            judul,
            deskripsi,
            jumlah,
            tanggal,
            kategori,
            buktiUrl: buktiUrl || "",
            createdBy,
            createdByName,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST /api/keuangan/transaksi:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
