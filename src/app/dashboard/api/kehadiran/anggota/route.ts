import { NextResponse, NextRequest } from "next/server";
import { getAbsenByNim } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id') as string;
        const tipe = searchParams.get('tipe') as string;
        const nim = searchParams.get('nim') as string;

        console.log("API params:", { id, tipe, nim });

        if (!id || !nim || !tipe) {
            return NextResponse.json({
                success: false,
                message: "Missing required parameters: id, tipe, and nim"
            }, { status: 400 });
        }

        // Call with (event collection/type, event ID, nim)
        // Note: getAbsenByNim params are misleadingly named
        const data = await getAbsenByNim(tipe, id, nim);
        console.log("getAbsenByNim result:", data);

        if (data.success) {
            return NextResponse.json({
                success: true,
                message: "Data kehadiran retrieved successfully.",
                data: data.data
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: data.message
            }, { status: 404 });
        }
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err instanceof Error ? err.message : "Internal server error"
        }, { status: 500 });
    }
}