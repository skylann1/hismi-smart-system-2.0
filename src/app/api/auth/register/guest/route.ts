import { NextRequest, NextResponse } from "next/server";
import { addGuest } from "@/lib/firebase/services";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nama, email, password } = body;

        // Basic validation
        if (!nama || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Semua field harus diisi." },
                { status: 400 }
            );
        }

        // Wrap addGuest in a promise since it uses a callback
        const result = await new Promise<{ success: boolean; message?: string }>((resolve) => {
            addGuest({ nama, email, password }, (res) => {
                resolve(res);
            });
        });

        if (result.success) {
            return NextResponse.json({ success: true, message: result.message }, { status: 201 });
        } else {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server.", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
