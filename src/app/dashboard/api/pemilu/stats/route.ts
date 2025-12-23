import { NextResponse } from "next/server";
import { getRealCountResults, getAllVotes } from "@/lib/firebase/services";

export async function GET() {
  try {
    // 1. Ambil Hasil Hitung Suara (Jumlah per paslon)
    const countRes = await getRealCountResults();

    // 2. Ambil 5 Suara Terakhir (Log aktivitas)
    const votesRes = await getAllVotes();

    // Sort votes berdasarkan waktu terbaru & ambil 5 aja
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentVotes = (votesRes.data || []).sort((a: any, b: any) => b.votingTime - a.votingTime).slice(0, 5);

    return NextResponse.json({
      success: true,
      summary: countRes.data,      // Data Paslon + Total Suara
      totalVotes: countRes.totalVotesAll,
      recentVotes: recentVotes     // 5 Log terakhir
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}