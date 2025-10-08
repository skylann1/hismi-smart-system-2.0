import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/firebase/services";
import type { UserType } from "@/types";

type UserSafe = Omit<UserType, "password">;

export async function GET(req: NextRequest, context: { params: Promise<{ divisi: string }> }) {
    try {
        const { divisi } = await context.params;

        const res = await getData("users");
        const anggota: UserSafe[] = (res?.datas as UserType[])
            .filter((anggota) => anggota.divisi === divisi)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ password, ...rest }) => rest);


        if (anggota.length > 0) {
            return NextResponse.json({ success: true, message: "Success retrieving anggota", data: anggota }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: "Anggota not found", data: anggota }, { status: 200 });
    } catch (err) {
        console.log(err)
    }
}