import { redirect } from "next/navigation";

export default function QrCodePage(){
  redirect(`/dashboard/kehadiran/absen`);
  return null;
}