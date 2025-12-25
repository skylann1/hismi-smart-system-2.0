import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "HIMSI UBSI KLA - Himpunan Mahasiswa Sistem Informasi",
  description:
    "HIMSI UBSI KLA (Himpunan Mahasiswa Sistem Informasi Universitas Bina Sarana Informatika Karawang) adalah organisasi mahasiswa yang berfokus pada pengembangan akademik dan non-akademik mahasiswa program studi Sistem Informasi.",
  keywords: [
    "HIMSI",
    "UBSI",
    "KLA",
    "Sistem Informasi",
    "Mahasiswa",
    "Organisasi",
    "Karawang",
  ],
  icons: {
    icon: "/assets/static-img/logo-himsi.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased max-w-7xl mx-auto `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
