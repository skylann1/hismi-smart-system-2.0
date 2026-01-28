import { NextRequest, NextResponse } from "next/server";
import { bulkCreateMemberPayments } from "@/lib/firebase/kasServices";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase/config";

const firestore = getFirestore(app);

// POST - Create kas for single user
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        const body = await req.json();
        const { startMonth, endMonth } = body;

        // Get user data
        const userDoc = await getDoc(doc(firestore, "users", userId));

        if (!userDoc.exists()) {
            return NextResponse.json({
                success: false,
                message: "User tidak ditemukan",
            }, { status: 404 });
        }

        const userData = userDoc.data();

        // Generate months
        const generateMonths = (start: string, end: string) => {
            const months: string[] = [];
            const [startYear, startMo] = start.split("-").map(Number);
            const [endYear, endMo] = end.split("-").map(Number);

            for (let year = startYear; year <= endYear; year++) {
                const startM = year === startYear ? startMo : 1;
                const endM = year === endYear ? endMo : 12;

                for (let month = startM; month <= endM; month++) {
                    months.push(`${year}-${String(month).padStart(2, "0")}`);
                }
            }
            return months;
        };

        const months = generateMonths(startMonth || "2025-01", endMonth || "2025-12");

        // Create payments
        const result = await bulkCreateMemberPayments(
            userId,
            userData.nama || "Unknown",
            userData.nim || "-",
            userData.divisi || "-",
            months
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST /api/keuangan/kas/anggota/[id]/create:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
