import { NextRequest, NextResponse } from "next/server";
import { getMemberPayments, updateMemberPayment } from "@/lib/firebase/kasServices";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase/config";

const firestore = getFirestore(app);

// GET - Get member payment details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params;
        console.log("Fetching kas for userId:", userId);

        const paymentsResult = await getMemberPayments(userId);
        console.log("Payments result:", paymentsResult);

        // If no payments found, try to get user data from users collection
        if (!paymentsResult.success || paymentsResult.data.length === 0) {
            // Check if user exists
            const userDoc = await getDoc(doc(firestore, "users", userId));

            if (!userDoc.exists()) {
                return NextResponse.json({
                    success: false,
                    message: "User tidak ditemukan di database",
                }, { status: 404 });
            }

            return NextResponse.json({
                success: false,
                message: "User ditemukan tapi belum ada data kas. Silakan initialize kas terlebih dahulu.",
                userData: userDoc.data(),
            });
        }

        const payments = paymentsResult.data;
        const memberData = {
            userId,
            nama: payments[0].nama,
            nim: payments[0].nim,
            divisi: payments[0].divisi,
            payments,
        };

        return NextResponse.json({
            success: true,
            data: memberData,
        });
    } catch (error) {
        console.error("Error in GET /api/keuangan/kas/anggota/[id]:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}

// PATCH - Update multiple payment statuses
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await params; // Satisfy Next.js requirement
        const body = await req.json();
        const { changes, updatedBy } = body;

        if (!changes || typeof changes !== "object") {
            return NextResponse.json(
                { success: false, message: "Invalid changes data" },
                { status: 400 }
            );
        }

        // Update each payment
        const updates = Object.entries(changes).map(([paymentId, isPaid]) =>
            updateMemberPayment(paymentId, isPaid as boolean, updatedBy)
        );

        await Promise.all(updates);

        return NextResponse.json({
            success: true,
            message: "Pembayaran berhasil diupdate",
        });
    } catch (error) {
        console.error("Error in PATCH /api/keuangan/kas/anggota/[id]:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
