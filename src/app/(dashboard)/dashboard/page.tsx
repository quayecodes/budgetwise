import { logoutUser } from "@/server/auth/actions";
import { requireUser } from "@/server/auth/session";
import { getDashboardSummary } from "@/server/dashboard/service";
import { formatMoney } from "@/lib/format";
import { DashboardNav } from "@/components/ui/dashboard-nav";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const summary = await getDashboardSummary(user.id);
  const budgetPercentage = summary.budget.budgetInCents
    ? Math.round((summary.budget.spentInCents / summary.budget.budgetInCents) * 100)
    : 0;
  const goalPercentage = summary.goals.targetInCents
    ? Math.round((summary.goals.currentInCents / summary.goals.targetInCents) * 100)
    : 0;

  const formatAmount = (amountInCents: number) =>
    formatMoney(amountInCents, user.profile?.currency);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-emerald-700 uppercase">BudgetWise</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <form action={logoutUser}>
          <button
            className="button-secondary"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>
      <DashboardNav />

      <section className="py-10">
        <p className="text-sm font-semibold tracking-[0.12em] text-emerald-700 uppercase">Your money, in focus</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Hello, {user.name}</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--ink-muted)]">
          A calm view of your current-month income, spending, budgets, and savings progress.
        </p>
        <nav aria-label="Financial tools" className="mt-6 flex flex-wrap gap-3">
          <Link
            className="button-primary"
            href="/transactions"
          >
            View transactions
          </Link>
          <Link
            className="button-secondary"
            href="/budgets"
          >
            Manage budgets
          </Link>
          <Link
            className="button-secondary"
            href="/goals"
          >
            Savings goals
          </Link>
          <Link
            className="button-secondary"
            href="/settings"
          >
            Settings
          </Link>
        </nav>
      </section>

      <section aria-label="Current month summary" className="grid gap-4 sm:grid-cols-3">
        <article className="surface p-5">
          <p className="text-sm font-medium text-[var(--ink-muted)]">Income</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-700">{formatAmount(summary.incomeInCents)}</p>
        </article>
        <article className="surface p-5">
          <p className="text-sm font-medium text-[var(--ink-muted)]">Expenses</p>
          <p className="mt-3 text-3xl font-semibold text-red-700">{formatAmount(summary.expensesInCents)}</p>
        </article>
        <article className="surface p-5">
          <p className="text-sm font-medium text-[var(--ink-muted)]">Balance</p>
          <p className={summary.balanceInCents < 0 ? "mt-3 text-3xl font-semibold text-red-700" : "mt-3 text-3xl font-semibold text-[var(--foreground)]"}>
            {formatAmount(summary.balanceInCents)}
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Budget progress</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                {summary.budget.budgetInCents
                  ? `${formatAmount(summary.budget.spentInCents)} of ${formatAmount(summary.budget.budgetInCents)} used`
                  : "No monthly budgets set yet."}
              </p>
            </div>
            <Link className="text-sm font-medium text-emerald-700" href="/budgets">
              View budgets
            </Link>
          </div>
          {summary.budget.budgetInCents ? (
            <>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200" aria-label={`${budgetPercentage}% of monthly budgets used`} role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.min(budgetPercentage, 100)}>
                <div className={budgetPercentage > 100 ? "h-full bg-red-600" : "h-full bg-emerald-600"} style={{ width: `${Math.min(budgetPercentage, 100)}%` }} />
              </div>
              <p className={budgetPercentage > 100 ? "mt-3 text-sm font-medium text-red-700" : "mt-3 text-sm text-[var(--ink-muted)]"}>
                {budgetPercentage > 100 ? `${formatAmount(summary.budget.spentInCents - summary.budget.budgetInCents)} over budget` : `${formatAmount(summary.budget.budgetInCents - summary.budget.spentInCents)} remaining`}
              </p>
            </>
          ) : null}
        </article>

        <article className="surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Savings goals</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                {summary.goals.count
                  ? `${formatAmount(summary.goals.currentInCents)} of ${formatAmount(summary.goals.targetInCents)} saved`
                  : "No active savings goals yet."}
              </p>
            </div>
            <Link className="text-sm font-medium text-emerald-700" href="/goals">
              View goals
            </Link>
          </div>
          {summary.goals.count ? (
            <>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200" aria-label={`${goalPercentage}% of savings goals complete`} role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.min(goalPercentage, 100)}>
                <div className="h-full bg-emerald-600" style={{ width: `${Math.min(goalPercentage, 100)}%` }} />
              </div>
              <p className="mt-3 text-sm text-[var(--ink-muted)]">{Math.min(goalPercentage, 100)}% complete across active goals</p>
            </>
          ) : null}
        </article>
      </section>
    </main>
  );
}
