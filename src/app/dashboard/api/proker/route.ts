import { NextResponse, NextRequest } from "next/server";
import { getDataById, getData } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (id) {
            const data = await getDataById("proker", id);
            if (data.success) {
                return NextResponse.json({ success: true, message: "Data proker retrieved successfully.", data: data.data }, { status: 200 })
            } else {
                return NextResponse.json({ success: false, message: data.message }, { status: 404 });
            }
        }

        const data = await getData("proker");
        if (data.success) {
            return NextResponse.json({ success: true, message: "Data proker retrieved successfully", data: data.datas }, { status: 200 })
        } else {
            return NextResponse.json({ success: false, message: data.error }, { status: 404 });
        }

    } catch (err) {
        return NextResponse.json({ status: false, message: err }, { status: 500 })
    }
}