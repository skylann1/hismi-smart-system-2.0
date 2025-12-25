import { NextResponse, type NextRequest } from "next/server";
import withAuth from "./middlewares/withAuth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mainMiddleware(_req: NextRequest) {
  const res = NextResponse.next();
  return res;
}

export default withAuth(mainMiddleware, ['/dashboard']);