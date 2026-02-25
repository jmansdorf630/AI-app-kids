"use client";

import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!navigator.onLine);
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="sticky top-0 z-[60] py-2 px-4 text-center text-sm font-semibold bg-amber-500 text-amber-950 dark:bg-amber-400 dark:text-amber-950"
      role="status"
      aria-live="polite"
    >
      Offline Mode — content may be from cache
    </div>
  );
}
