import { NextResponse, NextRequest } from "next/server";
import { getPaslons, getPaslonById } from "@/lib/firebase/services";

// Function GET untuk fetch data list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")

  if (id) {
    const paslon = await getPaslonById(id);

    if (paslon.success) {
      return NextResponse.json({ success: true, data: paslon.data });
    } else {
      return NextResponse.json({ success: false, message: paslon.message }, { status: 404 });
    }
  }

  const result = await getPaslons();

  if (result.success) {
    return NextResponse.json({ success: true, data: result.data });
  } else {
    return NextResponse.json({ success: false, message: result.message }, { status: 500 });
  }
}