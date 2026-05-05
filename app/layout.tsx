import { fontVariables } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cliniq",
  description: "Modern operating system for boutique and mid-size dental clinics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
