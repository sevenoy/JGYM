"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-outline/40 bg-white/82 px-3 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] pt-2 shadow-tab backdrop-blur-2xl">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition",
                active
                  ? "text-primary"
                  : "text-muted hover:bg-surface-soft hover:text-primary",
              )}
            >
              <Icon
                size={23}
                strokeWidth={active ? 2.4 : 2}
                aria-hidden="true"
              />
              <span>{item.label}</span>
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  active ? "bg-secondary" : "bg-transparent",
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
