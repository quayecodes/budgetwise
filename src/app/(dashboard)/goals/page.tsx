import { requireUser } from "@/server/auth/session";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/format";
import { addContributionAction, createGoalAction } from "@/server/goals/actions";
import { getGoals } from "@/server/goals/service";

type GoalsPageProps = {
  searchParams: Promise<{ error?: string }>;
};

function formatAmount(amountInCents: number, currency?: string) {
  return formatMoney(amountInCents, currency);
}

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
  const user = await requireUser();
  const [goals, { error }] = await Promise.all([getGoals(user.id), searchParams]);

  return (
    <DashboardShell
      title="Savings goals"
      description="Turn small contributions into meaningful progress."
      action={{ href: "/dashboard", label: "Dashboard" }}
    >
      <section className="grid gap-8 py-8 lg:grid-cols-[20rem_1fr]">
        <div>
          <h2 className="text-xl font-semibold">Create a goal</h2>
          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={createGoalAction} className="surface mt-6 space-y-4 p-5">
            <label className="block text-sm font-medium">
              Goal name
              <input className="form-control mt-2" name="name" type="text" maxLength={100} required />
            </label>
            <label className="block text-sm font-medium">
              Target amount
              <input className="form-control mt-2" name="targetAmount" type="text" inputMode="decimal" placeholder="0.00" required />
            </label>
            <label className="block text-sm font-medium">
              Target date <span className="font-normal text-neutral-500">(optional)</span>
              <input className="form-control mt-2" name="targetDate" type="date" />
            </label>
            <button className="button-primary w-full" type="submit">
              Create goal
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Your active goals</h2>
          {goals.length === 0 ? (
            <EmptyState title="No active goals" description="Create a savings goal to start tracking progress." />
          ) : (
            <div className="mt-6 space-y-4">
              {goals.map((goal) => {
                const percentage = Math.round((goal.currentAmountInCents / goal.targetAmountInCents) * 100);
                const complete = goal.currentAmountInCents >= goal.targetAmountInCents;
                return (
                  <article className="surface p-4" key={goal.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="mt-1 text-sm text-neutral-600">
                          {formatAmount(goal.currentAmountInCents, user.profile?.currency)} of {formatAmount(goal.targetAmountInCents, user.profile?.currency)}
                          {goal.targetDate ? ` · Due ${goal.targetDate.toISOString().slice(0, 10)}` : ""}
                        </p>
                      </div>
                      <p className={complete ? "text-sm font-semibold text-emerald-700" : "text-sm font-semibold text-neutral-700"}>
                        {Math.min(percentage, 100)}%
                      </p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200" aria-label={`${Math.min(percentage, 100)}% of ${goal.name} saved`} role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.min(percentage, 100)}>
                      <div className="h-full bg-emerald-600" style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                    <form action={addContributionAction} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <input name="goalId" type="hidden" value={goal.id} />
                      <label className="text-sm font-medium">
                        Add contribution
                        <input className="form-control mt-2" name="amount" type="text" inputMode="decimal" placeholder="0.00" required />
                      </label>
                      <label className="text-sm font-medium">
                        Note
                        <input className="form-control mt-2" name="note" type="text" maxLength={200} />
                      </label>
                      <button className="button-primary self-end" type="submit">
                        Add
                      </button>
                    </form>
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