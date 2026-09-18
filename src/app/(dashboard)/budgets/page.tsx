import { requireUser } from "@/server/auth/session";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { EmptyState } from "@/components/ui/empty-state";
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
    <DashboardShell
      title="Monthly budgets"
      description={`Set spending limits for ${workspace.startsAt.toLocaleString("en", { month: "long", year: "numeric", timeZone: "UTC" })}.`}
      action={{ href: "/transactions", label: "Transactions" }}
    >
      <section className="grid gap-8 py-8 lg:grid-cols-[20rem_1fr]">
        <div>
          <h2 className="text-xl font-semibold">Set a budget</h2>
          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={saveMonthlyBudgetAction} className="surface mt-6 space-y-4 p-5">
            <label className="block text-sm font-medium">
              Expense category
              <select className="form-control mt-2" name="categoryId" required>
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
              <input className="form-control mt-2" name="amount" type="text" inputMode="decimal" placeholder="0.00" required />
            </label>
            <button className="button-primary w-full" type="submit">
              Save budget
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Progress</h2>
          {workspace.budgets.length === 0 ? (
            <EmptyState title="No budgets this month" description="Set a category limit to start monitoring your spending." />
          ) : (
            <div className="mt-6 space-y-4">
              {workspace.budgets.map((budget) => {
                const percentage = Math.round((budget.spentInCents / budget.amountInCents) * 100);
                const progressWidth = Math.min(percentage, 100);
                const exceeded = budget.spentInCents > budget.amountInCents;

                return (
                  <article className="surface p-4" key={budget.id}>
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
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200" aria-label={`${percentage}% of ${budget.category.name} budget used${exceeded ? ", over budget" : ""}`} role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.min(percentage, 100)}>
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
    </DashboardShell>
  );
}