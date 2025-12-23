import { NextRequest, NextResponse } from "next/server";
import { getDataByNama } from "@/lib/firebase/services";
import { DivisiSettingsType } from "@/types";

export async function GET(req: NextRequest, context: { params: Promise<{ divisi: string }> }) {
    try {
        const { divisi } = await context.params;

        if (divisi) {
            const divisiData = await getDataByNama<DivisiSettingsType>("divisi", divisi);
            if (divisiData.success) {
                return NextResponse.json({ status: true, message: "Success retrieving divisi", data: divisiData.data }, { status: 200 });
            } else {
                return NextResponse.json({ status: true, message: divisiData.message }, { status: 404 });
            }
        }

        return NextResponse.json({ status: true, message: divisi }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ status: false, message: e }, { status: 500 });
    }
}