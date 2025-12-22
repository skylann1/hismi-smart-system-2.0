import { NextResponse } from "next/server";
import { getAllVotes } from "@/lib/firebase/services"; // Import function baru tadi

export async function GET() {
  try {
    // 1. Panggil Service
    const result = await getAllVotes();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    const votes = result.data || [];

    if (votes.length === 0) {
        return NextResponse.json({ success: false, message: "Belum ada data suara masuk." });
    }

    // 2. Format ke CSV String
    let csvString = "No,User ID,Email Pemilih,Waktu Voting\n";

    votes.forEach((vote, index) => {
        // Format Tanggal: DD/MM/YYYY HH:mm:ss
        const dateStr = vote.votingTime 
          ? vote.votingTime.toLocaleString("id-ID") 
          : "-";

        // Sanitize Email (Hapus koma biar CSV gak error)
        const cleanEmail = (vote.voterEmail).replace(/,/g, "");

        // Append Baris
        csvString += `${index + 1},${vote.id},${cleanEmail},"${dateStr}"\n`;
    });

    // 3. Kirim Response
    return NextResponse.json({ success: true, csvData: csvString });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}