import { NextResponse, NextRequest } from "next/server";
import { getDataById, getData } from "@/lib/firebase/services";
import type { UserType } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (id) {
            const user = await getDataById("users", id);
            if (user.success) {
                return NextResponse.json({ success: true, message: "User retrieved successfully", data: user.data }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, message: user.message }, { status: 404 });
            }
        }

        const users = await getData("users");
        if (users.success) {
            return NextResponse.json({ success: true, message: "Users retrieved successfully", data: (users.datas as UserType[])?.filter((user: UserType) => user.id !== "b6I29aMWusdiwHmmZA4zFgOduVu2") }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: users.error }, { status: 404 });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}