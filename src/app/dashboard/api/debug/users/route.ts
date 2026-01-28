// Quick script to check if users exist in Firestore
// Run this in browser console when logged into Firebase Console
// OR create a temporary API route

import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    try {
        const result = await getData("users");

        if (result.success) {
            // Return count and sample data (without passwords)
            const users = (result.datas || []).map((user: any) => ({
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                access: user.access,
            }));

            return NextResponse.json({
                success: true,
                count: users.length,
                users: users,
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
