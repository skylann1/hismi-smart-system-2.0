import { NextResponse } from "next/server";
import { updateAbsen, updateAbsenStatus } from "@/lib/firebase/services";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: eventId, absen, tipe } = body;

    console.log("Received attendance update request:", { eventId, tipe, absen });

    if (!eventId || !tipe) {
      return NextResponse.json(
        { success: false, message: "Event ID dan tipe harus diisi" },
        { status: 400 }
      );
    }

    if (!absen || !Array.isArray(absen) || absen.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data absen tidak valid" },
        { status: 400 }
      );
    }

    // If it's a single attendance update (from QR scanner)
    if (absen.length === 1 && absen[0].userId) {
      const { userId, status } = absen[0];

      if (!userId || !status) {
        return NextResponse.json(
          { success: false, message: "User ID dan status harus diisi" },
          { status: 400 }
        );
      }

      console.log("Updating single attendance:", { eventId, tipe, userId, status });
      const result = await updateAbsenStatus(eventId, tipe, userId, status);

      console.log("Update result:", result);
      return NextResponse.json(result, { status: result.success ? 200 : 500 });
    }

    // For batch updates (manual attendance), convert userId to id
    const formattedAbsen = absen.map(item => ({
      id: item.userId || item.id,
      status: item.status
    }));

    console.log("Batch updating attendance:", formattedAbsen);
    const result = await updateAbsen(eventId, formattedAbsen, tipe);

    console.log("Batch update result:", result);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in update route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
