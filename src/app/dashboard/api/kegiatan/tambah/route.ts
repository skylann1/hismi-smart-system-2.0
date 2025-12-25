import { NextRequest, NextResponse } from "next/server";
import { addKegiatan } from "@/lib/firebase/services";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json();
        if (!formData) {
            return NextResponse.json({ message: "No data provided" }, { status: 400 });
        }


        await new Promise<void>((resolve, reject) => {
            addKegiatan(formData, (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(new Error(result.message));
                }
            });
        });

        return NextResponse.json({ status: true, message: "Kegiatan added successfully", data: formData }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ status: false, message: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
    }
}
