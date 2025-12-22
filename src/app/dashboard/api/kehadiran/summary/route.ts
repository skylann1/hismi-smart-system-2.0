import { NextResponse, NextRequest } from "next/server";
import { getAllAbsenFromAllCollections, getAllAbsenByAnggotaIdWithUser } from "@/lib/firebase/services";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id') as string;

        if (id) {
            const data = await getAllAbsenByAnggotaIdWithUser(id);
            if (data.success) {
                return NextResponse.json({ success: true, message: "Summary kehadiran retrieved successfully.", data: {
                    userInformation: data.user,
                    absensiData: data.data
                } }, { status: 200 });
            } else {
                return NextResponse.json({ success: false, message: data.message }, { status: 404 });
            }
        }

        const data = await getAllAbsenFromAllCollections();
        if (data.success) {
            return NextResponse.json({ success: true, message: "Summary kehadiran retrieved successfully.", data: data.data }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: data.message }, { status: 404 });
        }


    } catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 500 });
    }
}