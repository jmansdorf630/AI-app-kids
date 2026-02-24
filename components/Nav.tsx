"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/learn", label: "Learn", emoji: "📚" },
  { href: "/daily", label: "Daily", emoji: "⚡" },
  { href: "/profile", label: "Profile", emoji: "👤" },
  { href: "/settings", label: "Settings", emoji: "⚙️" },
  { href: "/admin/content", label: "Admin", emoji: "🛠" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-indigo-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg text-indigo-600 flex items-center gap-1">
          <span>🤖</span> AI Quest
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, emoji }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-indigo-50"}`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{emoji}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
