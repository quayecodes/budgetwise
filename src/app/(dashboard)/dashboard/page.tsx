import { logoutUser } from "@/server/auth/actions";
import { requireUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

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
          Your secure account is ready. Transaction tracking, budgets, savings goals, and
          dashboard summaries will be introduced in the next approved phases.
        </p>
      </section>
    </main>
  );
}
