import { NextResponse, NextRequest } from "next/server";
import { getDataByNama } from "@/lib/firebase/services";

export async function GET(req: NextRequest){
    try {
        const res = await getDataByNama('divisi', 'bph');
        
        if(!res.success){
            return NextResponse.json({ status: false, message: res.message }, { status: 404 });
        }

        return NextResponse.json({ status: true, message: "Success retrieving bph", data: res }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ status: false, message: e }, { status: 500 });
    }
}