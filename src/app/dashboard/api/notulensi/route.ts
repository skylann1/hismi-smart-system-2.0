import { NextResponse, NextRequest } from "next/server";
import { getNotulensi, addNotulensi } from "@/lib/firebase/services";

export async function GET() {
    const result = await getNotulensi();
    if (result.success) {
        return NextResponse.json({ success: true, data: result.data });
    } else {
        return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await addNotulensi(body);

        if (result.success) {
            return NextResponse.json({ success: true, id: result.id });
        } else {
            return NextResponse.json({ success: false, message: result.message }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }
}
