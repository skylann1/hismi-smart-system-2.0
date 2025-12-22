import { NextResponse, NextRequest } from "next/server";
import { getAbsenInCollection } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id') as string;
        const tipe = searchParams.get('tipe') as string;
        console.log(tipe, id);
        if (id) {
            const data = await getAbsenInCollection(tipe, id);
            if (data.success) {
                return NextResponse.json({ success: true, message: "Data kehadiran retrieved successfully.", data: data.data }, { status: 200 })
            } else {
                return NextResponse.json({ success: false, message: data.message }, { status: 404 });
            }
        }
        return NextResponse.json({ success: false, message: "Data kehadiran not found." }, { status: 404 });
    } catch (err) {
        return NextResponse.json({ status: false, message: err }, { status: 500 })
    }
}