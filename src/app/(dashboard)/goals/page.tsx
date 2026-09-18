import Link from "next/link";

import { requireUser } from "@/server/auth/session";
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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8">
      <header className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <Link className="text-sm font-medium text-emerald-700" href="/dashboard">
            BudgetWise
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Savings goals</h1>
          <p className="mt-2 text-sm text-neutral-600">Turn small contributions into meaningful progress.</p>
        </div>
        <Link className="text-sm font-medium text-emerald-700" href="/dashboard">
          Dashboard
        </Link>
      </header>

      <section className="grid gap-8 py-8 lg:grid-cols-[20rem_1fr]">
        <div>
          <h2 className="text-xl font-semibold">Create a goal</h2>
          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={createGoalAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Goal name
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="name" type="text" maxLength={100} required />
            </label>
            <label className="block text-sm font-medium">
              Target amount
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="targetAmount" type="text" inputMode="decimal" placeholder="0.00" required />
            </label>
            <label className="block text-sm font-medium">
              Target date <span className="font-normal text-neutral-500">(optional)</span>
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="targetDate" type="date" />
            </label>
            <button className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" type="submit">
              Create goal
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Your active goals</h2>
          {goals.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-neutral-300 px-4 py-8 text-sm text-neutral-600">
              No savings goals yet. Create one to start tracking progress.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {goals.map((goal) => {
                const percentage = Math.round((goal.currentAmountInCents / goal.targetAmountInCents) * 100);
                const complete = goal.currentAmountInCents >= goal.targetAmountInCents;
                return (
                  <article className="rounded-md border border-neutral-200 p-4" key={goal.id}>
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
                        <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="amount" type="text" inputMode="decimal" placeholder="0.00" required />
                      </label>
                      <label className="text-sm font-medium">
                        Note
                        <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="note" type="text" maxLength={200} />
                      </label>
                      <button className="self-end rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700" type="submit">
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
    </main>
  );
}