import { logoutUser } from "@/server/auth/actions";
import { requireUser } from "@/server/auth/session";
import { getDashboardSummary } from "@/server/dashboard/service";
import { formatMoney } from "@/lib/format";
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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8">
      <header className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">BudgetWise</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <form action={logoutUser}>
          <button
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-500"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="py-8">
        <h2 className="text-xl font-semibold">Hello, {user.name}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Here is your current-month financial overview.
        </p>
        <nav aria-label="Financial tools" className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            href="/transactions"
          >
            View transactions
          </Link>
          <Link
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
            href="/budgets"
          >
            Manage budgets
          </Link>
          <Link
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
            href="/goals"
          >
            Savings goals
          </Link>
          <Link
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-neutral-500"
            href="/settings"
          >
            Settings
          </Link>
        </nav>
      </section>

      <section aria-label="Current month summary" className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-md border border-neutral-200 p-5">
          <p className="text-sm text-neutral-600">Income</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{formatAmount(summary.incomeInCents)}</p>
        </article>
        <article className="rounded-md border border-neutral-200 p-5">
          <p className="text-sm text-neutral-600">Expenses</p>
          <p className="mt-2 text-2xl font-semibold text-red-700">{formatAmount(summary.expensesInCents)}</p>
        </article>
        <article className="rounded-md border border-neutral-200 p-5">
          <p className="text-sm text-neutral-600">Balance</p>
          <p className={summary.balanceInCents < 0 ? "mt-2 text-2xl font-semibold text-red-700" : "mt-2 text-2xl font-semibold"}>
            {formatAmount(summary.balanceInCents)}
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-neutral-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Budget progress</h2>
              <p className="mt-1 text-sm text-neutral-600">
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
              <p className={budgetPercentage > 100 ? "mt-3 text-sm font-medium text-red-700" : "mt-3 text-sm text-neutral-600"}>
                {budgetPercentage > 100 ? `${formatAmount(summary.budget.spentInCents - summary.budget.budgetInCents)} over budget` : `${formatAmount(summary.budget.budgetInCents - summary.budget.spentInCents)} remaining`}
              </p>
            </>
          ) : null}
        </article>

        <article className="rounded-md border border-neutral-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Savings goals</h2>
              <p className="mt-1 text-sm text-neutral-600">
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
              <p className="mt-3 text-sm text-neutral-600">{Math.min(goalPercentage, 100)}% complete across active goals</p>
            </>
          ) : null}
        </article>
      </section>
    </main>
  );
}
