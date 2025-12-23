import { NextResponse } from "next/server";
import { getData } from "@/lib/firebase/services";

export async function GET() {
    const result = await getData("users");
    if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const users = (result.datas as any[]).map((u) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = u;
            return rest;
        });
        return NextResponse.json({ success: true, data: users });
    }
    return NextResponse.json({ success: false, message: result.message }, { status: 500 });
}
