import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    const needAuth = requireAuth.some((path) => pathname.startsWith(path));

    if (needAuth) {
      const token = await getToken({
        req,
        secret: process.env.NEXT_AUTH_SECRET_TOKEN,
      });

      if (!token) {
        const url = new URL("/member/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }
    }

    return middleware(req, next);
  };
}
