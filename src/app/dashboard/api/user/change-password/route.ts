import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/config";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

const firestore = getFirestore(app);

export async function POST(req: NextRequest) {
    try {
        // Get current user from session
        const token = await getToken({
            req,
            secret: process.env.NEXT_AUTH_SECRET_TOKEN,
        });

        if (!token || !token.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = token.id as string;
        const { oldPassword, newPassword } = await req.json();

        // Validation
        if (!oldPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Old password dan new password wajib diisi" },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, message: "Password minimal 8 karakter" },
                { status: 400 }
            );
        }

        // Get user data
        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return NextResponse.json(
                { success: false, message: "User tidak ditemukan" },
                { status: 404 }
            );
        }

        const userData = userDoc.data();

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, userData.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Password lama salah" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await updateDoc(userRef, {
            password: hashedPassword,
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Password berhasil diubah",
        });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
