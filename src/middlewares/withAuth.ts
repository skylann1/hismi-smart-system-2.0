import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";

const ROLES = {
  ALL_ACCESS: "-",
  ANGGOTA: "1",
  KOORDINATOR: "2",
  EDITOR_ABSENSI: "3",
  PUBLIKASI: "4",
  KONSUL_HIMSI: "5",
  KONSUL_TUGAS: "6",
  BENDAHARA: "7",
  SEKRETARIS: "8",
  KETUA_WAKIL: "9",
  SETTINGS: "10",
  GUEST: "guest",
};

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

      const userRoles = (token.access as string[]) || [];

      // God mode check
      if (userRoles.includes(ROLES.ALL_ACCESS)) {
        return middleware(req, next);
      }

      // Helper to check access
      const hasRole = (allowedRoles: string[]) => userRoles.some(role => allowedRoles.includes(role));

      // 0. GUEST RESTRICTION
      if (userRoles.includes(ROLES.GUEST)) {
        const allowedPaths = [
          "/dashboard/pemilu/votes",
          "/dashboard/profile",
          "/dashboard/pemilu/result",
          "/dashboard/pemilu/information",
          "/dashboard/api/pemilu" // Allow API access for config/voting
        ];
        // Check if current path starts with any allowed path
        const isAllowed = allowedPaths.some(path => pathname.startsWith(path));

        if (!isAllowed) {
          return NextResponse.redirect(new URL("/dashboard/pemilu/votes", req.url));
        }
        return middleware(req, next);
      }

      // 1. Kehadiran Logic (Complex because of Rekap)
      if (pathname.startsWith("/dashboard/kehadiran")) {
        // Rekap is open to everyone
        if (pathname.startsWith("/dashboard/kehadiran/rekap")) {
          return middleware(req, next);
        }
        // Other kehadiran pages need specific roles
        if (!hasRole([ROLES.EDITOR_ABSENSI, ROLES.SETTINGS])) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      // 2. Other simple restrictions
      const restrictions = [
        { path: "/dashboard/anggota", roles: [ROLES.KOORDINATOR, ROLES.KETUA_WAKIL, ROLES.SETTINGS] },
        { path: "/dashboard/pertemuan", roles: [ROLES.SEKRETARIS, ROLES.KETUA_WAKIL, ROLES.SETTINGS] },
        { path: "/dashboard/publikasi", roles: [ROLES.PUBLIKASI, ROLES.SETTINGS] },
        { path: "/dashboard/notulensi", roles: [ROLES.SEKRETARIS, ROLES.KETUA_WAKIL, ROLES.SETTINGS] },
        // Keuangan removed - open to all members for transparency
        { path: "/dashboard/proker", roles: [ROLES.KOORDINATOR, ROLES.KETUA_WAKIL, ROLES.SETTINGS] },
        { path: "/dashboard/kegiatan", roles: [ROLES.KOORDINATOR, ROLES.KETUA_WAKIL, ROLES.SETTINGS] },
        { path: "/dashboard/settings", roles: [ROLES.SETTINGS] },
      ];

      for (const rule of restrictions) {
        if (pathname.startsWith(rule.path) && !hasRole(rule.roles)) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    return middleware(req, next);
  };
}
