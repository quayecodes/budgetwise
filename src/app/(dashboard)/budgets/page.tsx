import Link from "next/link";

import { requireUser } from "@/server/auth/session";
import { formatMoney } from "@/lib/format";
import { ensureDefaultCategories, listCategories } from "@/server/transactions/repository";
import { saveMonthlyBudgetAction } from "@/server/budgets/actions";
import { getBudgetWorkspace } from "@/server/budgets/service";

type BudgetsPageProps = {
  searchParams: Promise<{ error?: string }>;
};

function formatAmount(amountInCents: number, currency?: string) {
  return formatMoney(amountInCents, currency);
}

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const user = await requireUser();
  await ensureDefaultCategories(user.id);
  const [{ categories }, workspace, { error }] = await Promise.all([
    listCategories(user.id).then((items) => ({ categories: items.filter((item) => item.type === "EXPENSE") })),
    getBudgetWorkspace(user.id),
    searchParams,
  ]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8">
      <header className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <Link className="text-sm font-medium text-emerald-700" href="/dashboard">
            BudgetWise
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Monthly budgets</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Set spending limits for {workspace.startsAt.toLocaleString("en", { month: "long", year: "numeric", timeZone: "UTC" })}.
          </p>
        </div>
        <Link className="text-sm font-medium text-emerald-700" href="/transactions">
          Transactions
        </Link>
      </header>

      <section className="grid gap-8 py-8 lg:grid-cols-[20rem_1fr]">
        <div>
          <h2 className="text-xl font-semibold">Set a budget</h2>
          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={saveMonthlyBudgetAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Expense category
              <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="categoryId" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Monthly limit
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="amount" type="text" inputMode="decimal" placeholder="0.00" required />
            </label>
            <button className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" type="submit">
              Save budget
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Progress</h2>
          {workspace.budgets.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-neutral-300 px-4 py-8 text-sm text-neutral-600">
              No budgets set for this month yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {workspace.budgets.map((budget) => {
                const percentage = Math.round((budget.spentInCents / budget.amountInCents) * 100);
                const progressWidth = Math.min(percentage, 100);
                const exceeded = budget.spentInCents > budget.amountInCents;

                return (
                  <article className="rounded-md border border-neutral-200 p-4" key={budget.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{budget.category.name}</h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {formatAmount(budget.spentInCents, user.profile?.currency)} spent of {formatAmount(budget.amountInCents, user.profile?.currency)}
                        </p>
                      </div>
                      <p className={exceeded ? "text-sm font-semibold text-red-700" : "text-sm font-semibold text-emerald-700"}>
                        {percentage}%
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200" aria-label={`${percentage}% of ${budget.category.name} budget used`} role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.min(percentage, 100)}>
                      <div className={exceeded ? "h-full bg-red-600" : "h-full bg-emerald-600"} style={{ width: `${progressWidth}%` }} />
                    </div>
                    <p className={exceeded ? "mt-3 text-sm font-medium text-red-700" : "mt-3 text-sm text-neutral-600"}>
                      {exceeded ? `${formatAmount(budget.spentInCents - budget.amountInCents, user.profile?.currency)} over budget` : `${formatAmount(budget.amountInCents - budget.spentInCents, user.profile?.currency)} remaining`}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}