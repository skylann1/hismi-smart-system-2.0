import { NextResponse, NextRequest } from "next/server";
import { getAbsenByNim } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id') as string;
        const tipe = searchParams.get('tipe') as string;
        const nim = searchParams.get('nim') as string;

        console.log(id, tipe, nim)

        if (id || nim || tipe) {
            const data = await getAbsenByNim(tipe, id, nim);
            console.log(data)
            if (data.success) {
                return NextResponse.json({ success: true, message: "Data kehadiran retrieved successfully.", data: data.data }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, message: data.message }, { status: 404 });
            }
        }

        return NextResponse.json({ success: true, message: "Data kehadiran retrieved successfully.", data: [] }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 500 });
    }
}