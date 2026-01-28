import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/config";

const firestore = getFirestore(app);

// GET - Get single transaction
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: transactionId } = await params;

        const transactionRef = doc(firestore, "transactions", transactionId);
        const transactionDoc = await getDoc(transactionRef);

        if (!transactionDoc.exists()) {
            return NextResponse.json({
                success: false,
                message: "Transaksi tidak ditemukan",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: transactionDoc.id,
                ...transactionDoc.data(),
            },
        });
    } catch (error) {
        console.error("Error getting transaction:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// PUT - Update transaction
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: transactionId } = await params;
        const body = await req.json();

        const transactionRef = doc(firestore, "transactions", transactionId);

        await updateDoc(transactionRef, {
            ...body,
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Transaksi berhasil diupdate",
        });
    } catch (error) {
        console.error("Error updating transaction:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete transaction
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: transactionId } = await params;

        const transactionRef = doc(firestore, "transactions", transactionId);
        await deleteDoc(transactionRef);

        return NextResponse.json({
            success: true,
            message: "Transaksi berhasil dihapus",
        });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
