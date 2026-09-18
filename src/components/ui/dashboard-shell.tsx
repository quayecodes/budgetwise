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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link className="text-sm font-semibold tracking-wide text-emerald-700" href="/dashboard">
            BudgetWise
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">{description}</p> : null}
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