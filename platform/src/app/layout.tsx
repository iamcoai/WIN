import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

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
      className={cn(
        "scroll-smooth",
        inter.variable,
        manrope.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-sans shadow-lg border border-border rounded-xl",
            },
          }}
        />
      </body>
    </html>
  );
}
