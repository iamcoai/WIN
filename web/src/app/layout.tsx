import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: {
    default: "WIN — Weerbaarheids Instituut Nederland",
    template: "%s | WIN",
  },
  description:
    "Opleiding, coaching & kennisinstituut voor Weerbaarheid, Groei & Leiderschap. Integratief & Psychofysiek. Lijf & Brein in lijn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${manrope.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <Navigation />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
