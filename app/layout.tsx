import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "AI Quest – Learn AI the Fun Way!",
  description: "Short lessons, XP, streaks, and badges. Kids learn LLM and AI basics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
