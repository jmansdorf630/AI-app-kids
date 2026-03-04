"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadProgress } from "@/lib/progress";

/** Redirects to /onboarding if the user has not selected a learning track yet. */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname === "/onboarding") return;
    const state = loadProgress();
    const track = state.settings?.learningTrack;
    if (track == null || track === "") {
      router.replace("/onboarding");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
