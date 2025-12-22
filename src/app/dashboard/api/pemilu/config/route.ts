import { NextRequest, NextResponse } from "next/server";
import { getPemiluConfig, updatePemiluConfig } from "@/lib/firebase/services";

export async function GET() {
  const res = await getPemiluConfig();
  return NextResponse.json(res);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { isVotingOpen, isResultPublished } = body;
    
    const res = await updatePemiluConfig({ isVotingOpen, isResultPublished });
    
    if(!res.success) throw new Error(res.message);
    
    return NextResponse.json({ success: true, message: "Config saved" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}