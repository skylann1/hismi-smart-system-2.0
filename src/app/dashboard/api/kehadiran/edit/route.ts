import { NextResponse } from "next/server";
import { updateAbsen } from "@/lib/firebase/services";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: eventId, absen, tipe } = body;

    if (!eventId || !absen || !Array.isArray(absen)) {
      return NextResponse.json(
        { success: false, message: "Data tidak valid" },
        { status: 400 }
      );
    }

    const result = await updateAbsen(eventId, absen, tipe);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in update route:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
