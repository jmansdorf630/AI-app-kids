import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeAndAccessibilityInit } from "@/components/ThemeAndAccessibilityInit";
import { OfflineBanner } from "@/components/OfflineBanner";

export const metadata: Metadata = {
  title: "AI Quest – Learn AI the Fun Way!",
  description: "Short lessons, XP, streaks, and badges. Kids learn LLM and AI basics.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#312e81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeAndAccessibilityInit />
        <OfflineBanner />
        <Nav />
        <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
