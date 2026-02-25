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
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-indigo-100 dark:border-indigo-900 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg text-indigo-600 dark:text-indigo-400 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded-lg">
          <span>🤖</span> AI Quest
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, emoji }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isActive ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200" : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"}`}
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
