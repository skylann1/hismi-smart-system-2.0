import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({ status: true, message: "Success retrieving anggota", data: [] }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ status: false, message: e }, { status: 500 });
    }
}