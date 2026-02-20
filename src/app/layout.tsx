import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import { TopBar } from "@/components/layout/TopBar";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KodNest Premium Build System",
  description: "A premium SaaS design system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${inter.variable} antialiased bg-[#F7F6F3] text-[#111111]`}
      >
        <TopBar />
        {children}
      </body>
    </html>
  );
}
