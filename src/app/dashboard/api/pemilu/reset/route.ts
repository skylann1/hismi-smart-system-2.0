import { NextResponse } from "next/server";
import { resetAllVotes } from "@/lib/firebase/services";

export async function DELETE() {
  try {
    const res = await resetAllVotes();
    if (!res.success) throw new Error(res.message);

    return NextResponse.json({ success: true, message: res.message });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}