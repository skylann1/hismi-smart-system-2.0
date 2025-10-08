import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "HIMSI KLA SMART SYSTEM",
  description:
    "Himsi smart system is a system that can help you to manage your class schedule, and also help you to manage your class assignment",
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
