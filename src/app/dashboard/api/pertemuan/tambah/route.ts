import { NextResponse, NextRequest } from "next/server";
import type { PertemuanFormData } from "@/types";
import { addPertemuan } from "@/lib/firebase/services";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json() as PertemuanFormData;

        await new Promise<void>((resolve, reject) => {
            addPertemuan(formData, (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(new Error(result.message));
                }
            });
        });

        return NextResponse.json({ success: true, message: "Data pertemuan added successfully.", data: formData }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
    }
}