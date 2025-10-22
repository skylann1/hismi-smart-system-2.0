import { NextResponse } from "next/server";
import { getDataByNama } from "@/lib/firebase/services";

export async function GET(){
    try {
        const res = await getDataByNama('divisi', 'bph');
        const {  ...rest } = res.data;
        if(!res.success){
            return NextResponse.json({ status: false, message: res.message }, { status: 404 });
        }

        return NextResponse.json({ status: true, message: "Success retrieving bph", data: rest }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ status: false, message: e }, { status: 500 });
    }
}