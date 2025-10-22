import { NextRequest, NextResponse } from "next/server";
import { addProker } from "@/lib/firebase/services";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json();
        if (!formData) {
            return NextResponse.json({ message: "No data provided" }, { status: 400 });
        }


        await new Promise<void>((resolve, reject) => {
            addProker(formData, (result) => {
                if (result.success) {
                    resolve();
                } else {
                    reject(new Error(result.message));
                }
            });
        });

        return NextResponse.json({ status: true, message: "Proker added successfully", data: formData }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ status: false, message: err }, { status: 500 });
    }
}
