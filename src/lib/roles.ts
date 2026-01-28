// 1. DEFINISI ROLE (Biar gampang dipanggil)
export const ROLES = {
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
  ADMIN: "10", // Alias for SETTINGS
  GUEST: "guest",
};

/**
 * 2. LOGIC PENGECEKAN
 * @param userRoles Array string dari database user (contoh: ["2", "6"])
 * @param requiredRole Role yang dibutuhkan untuk akses fitur ini
 * @returns boolean (Boleh atau Enggak)
 */
export function hasAccess(userRoles: string[] | undefined | null, requiredRole: string | string[]) {
  // Kalau user gak punya role atau datanya null, tendang.
  if (!userRoles || userRoles.length === 0) return false;

  // RULE 1: GOD MODE (Super Admin)
  // Kalau user punya role "-", dia bisa akses APAPUN.
  if (userRoles.includes(ROLES.ALL_ACCESS)) return true;

  // RULE 2: Cek Role Spesifik
  if (Array.isArray(requiredRole)) {
    // Kalau butuh SALAH SATU dari array (misal: Ketua OR Sekretaris boleh masuk)
    return requiredRole.some((role) => userRoles.includes(role));
  } else {
    // Kalau butuh role tunggal
    return userRoles.includes(requiredRole);
  }
}