export default function getAccessByRoleAndDivisi(role: string, divisi: string): number[] {
  let access: number[] = [1]; 

  if (role === "koordinator" || role === "wakil") {
    if (divisi === "pendidikan") {
      access = [2, 5]; 
    } else if (divisi === "kominfo") {
      access = [2, 4];
    } else if (divisi === "litbang") {
      access = [2, 6];
    } else if (divisi === "rsdm") {
      access = [2, 3];
    }
  } else if (role === "bendahara") {
    access = [7];
  } else if (role === "sekretaris") {
    access = [8];
  } else if (role === "ketua" || role === "wakil-ketua") {
    access = [9];
  } else if (role === "admin") {
    access = [10];
  }

  return access;
}
