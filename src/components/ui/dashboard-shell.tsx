import Link from "next/link";

import { DashboardNav } from "@/components/ui/dashboard-nav";

type DashboardShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: {
    href: string;
    label: string;
  };
};

export function DashboardShell({ title, description, action, children }: DashboardShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link className="text-sm font-semibold tracking-[0.12em] text-emerald-700 uppercase" href="/dashboard">
            BudgetWise
          </Link>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">{description}</p> : null}
        </div>
        {action ? (
          <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href={action.href}>
            {action.label}
          </Link>
        ) : null}
      </header>
      <DashboardNav />
      {children}
    </main>
  );
}