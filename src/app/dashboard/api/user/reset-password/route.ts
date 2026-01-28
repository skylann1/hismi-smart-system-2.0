import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/config";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";

const firestore = getFirestore(app);

const ROLES = {
    ALL_ACCESS: "-",
    SETTINGS: "10",
};

export async function POST(req: NextRequest) {
    try {
        // Get current user from session (must be admin)
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

        const adminRoles = (token.access as string[]) || [];

        // Check if admin
        if (!adminRoles.includes(ROLES.ALL_ACCESS) && !adminRoles.includes(ROLES.SETTINGS)) {
            return NextResponse.json(
                { success: false, message: "Only admin can reset passwords" },
                { status: 403 }
            );
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
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

        // Generate default password from birthdate (YYYYMMDD format)
        // Field name is tanggal_lahir in database (format: YYYY-MM-DD)
        let defaultPassword = "";

        if (userData.tanggal_lahir) {
            // tanggal_lahir is stored as "YYYY-MM-DD" string
            const birthdate = new Date(userData.tanggal_lahir);
            const year = birthdate.getFullYear();
            const month = String(birthdate.getMonth() + 1).padStart(2, "0");
            const day = String(birthdate.getDate()).padStart(2, "0");
            defaultPassword = `${year}${month}${day}`;
        } else {
            return NextResponse.json(
                { success: false, message: "User tidak memiliki tanggal lahir. Tidak bisa reset password." },
                { status: 400 }
            );
        }

        // Hash the default password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Update password
        await updateDoc(userRef, {
            password: hashedPassword,
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Password berhasil direset",
            data: {
                userId,
                userName: userData.nama,
                newPassword: defaultPassword,
            },
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
