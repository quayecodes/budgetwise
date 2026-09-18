"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/budgets", label: "Budgets" },
  { href: "/goals", label: "Savings goals" },
  { href: "/settings", label: "Settings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="flex flex-wrap gap-x-5 gap-y-2 border-b border-[var(--line)] py-4 text-sm">
      {navigationItems.map((item) => {
        const isActive = item.href === "/dashboard"
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
        <Link
          aria-current={isActive ? "page" : undefined}
          className={isActive ? "font-semibold text-emerald-700" : "font-medium text-[var(--ink-muted)] transition-colors hover:text-emerald-700"}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
        );
      })}
    </nav>
  );
}