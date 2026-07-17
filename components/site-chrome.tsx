"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrototype = pathname?.startsWith("/prototype") ?? false;

  if (isPrototype) {
    return <>{children}</>;
  }

  return (
    <div className="site-shell">
      <SiteHeader pathname={pathname ?? "/"} />
      <main className="site-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
