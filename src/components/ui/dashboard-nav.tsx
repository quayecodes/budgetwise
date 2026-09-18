import Link from "next/link";

const navigationItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/budgets", label: "Budgets" },
  { href: "/goals", label: "Savings goals" },
  { href: "/settings", label: "Settings" },
];

export function DashboardNav() {
  return (
    <nav aria-label="Primary navigation" className="flex flex-wrap gap-x-5 gap-y-2 border-b border-neutral-200 py-3 text-sm">
      {navigationItems.map((item) => (
        <Link className="font-medium text-neutral-600 hover:text-emerald-700" href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}