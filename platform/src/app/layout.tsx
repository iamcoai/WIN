import type { Metadata } from "next";
import { Inter, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    default: "WIN Platform",
    template: "%s | WIN Platform",
  },
  description: "Coaching platform voor cliënten, coaches en admins van WIN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={cn("scroll-smooth", inter.variable, manrope.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
