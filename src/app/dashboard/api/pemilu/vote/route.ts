import { NextRequest, NextResponse } from "next/server";
import { submitVote, checkUserVoted, getPemiluConfig } from "@/lib/firebase/services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, paslonId, userProfile } = body; 
    // CATATAN: Idealnya userId diambil dari Session/Token di server (NextAuth), bukan dari body request (tidak aman).
    // Tapi untuk contoh ini kita ambil dari body.

    if (!userId || !paslonId) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Cek Apakah Voting Sedang Buka?
    const config = await getPemiluConfig();
    if (!config.data?.isVotingOpen) {
      return NextResponse.json({ success: false, message: "Sesi voting sedang ditutup." }, { status: 403 });
    }

    // 2. Cek Apakah User Sudah Vote?
    const hasVoted = await checkUserVoted(userId);
    if (hasVoted) {
      return NextResponse.json({ success: false, message: "Anda sudah menggunakan hak suara." }, { status: 403 });
    }

    // 3. Submit Vote
    const result = await submitVote(userId, paslonId, userProfile);

    if (!result.success) throw new Error(result.message);

    return NextResponse.json({ success: true, message: "Terima kasih, suara Anda telah direkam." });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}