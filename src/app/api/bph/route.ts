import { NextResponse } from "next/server";
import { getDataByNama } from "@/lib/firebase/services";
import { DivisiSettingsType } from "@/types";

export async function GET() {
    try {
        const res = await getDataByNama<DivisiSettingsType>('divisi', 'bph');
        if (!res.success) {
            return NextResponse.json({ status: false, message: res.message }, { status: 404 });
        }
        const { ...rest } = res.data;

        return NextResponse.json({ status: true, message: "Success retrieving bph", data: rest }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ status: false, message: e }, { status: 500 });
    }
}