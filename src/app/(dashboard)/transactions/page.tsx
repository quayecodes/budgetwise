import Link from "next/link";

import { requireUser } from "@/server/auth/session";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { formatMoney } from "@/lib/format";
import { ensureDefaultCategories } from "@/server/transactions/repository";
import { getTransactionWorkspace } from "@/server/transactions/service";
import { createTransactionAction, deleteTransactionAction } from "@/server/transactions/actions";

type TransactionsPageProps = {
  searchParams: Promise<{
    error?: string;
    type?: string;
    categoryId?: string;
    from?: string;
    to?: string;
    query?: string;
  }>;
};

function formatAmount(amountInCents: number, type: string, currency?: string) {
  const amount = formatMoney(amountInCents, currency);
  return `${type === "EXPENSE" ? "-" : "+"}${amount}`;
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const user = await requireUser();
  await ensureDefaultCategories(user.id);
  const params = await searchParams;
  const [{ categories, transactions }, { error }] = await Promise.all([
    getTransactionWorkspace(user.id, params),
    Promise.resolve(params),
  ]);

  return (
    <DashboardShell title="Transactions" action={{ href: "/dashboard", label: "Dashboard" }}>
      <section className="grid gap-8 py-8 lg:grid-cols-[20rem_1fr]">
        <div>
          <h2 className="text-xl font-semibold">Add transaction</h2>
          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <form action={createTransactionAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Type
              <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="type" defaultValue="EXPENSE">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Amount
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="amount" type="text" inputMode="decimal" placeholder="0.00" required />
            </label>
            <label className="block text-sm font-medium">
              Category
              <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="categoryId" required>
                <option value="">Select a category</option>
                <optgroup label="Expenses">
                  {categories
                    .filter((category) => category.type === "EXPENSE")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Income">
                  {categories
                    .filter((category) => category.type === "INCOME")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Date
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="occurredAt" type="date" required />
            </label>
            <label className="block text-sm font-medium">
              Note
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="description" type="text" maxLength={200} />
            </label>
            <button className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" type="submit">
              Add transaction
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold">History</h2>
          <form className="mt-6 grid gap-3 rounded-md border border-neutral-200 p-4 sm:grid-cols-2" method="get">
            <label className="text-sm font-medium">
              Search
              <input
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal"
                defaultValue={params.query}
                name="query"
                placeholder="Description or category"
                type="search"
              />
            </label>
            <label className="text-sm font-medium">
              Type
              <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={params.type ?? ""} name="type">
                <option value="">All types</option>
                <option value="EXPENSE">Expenses</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Category
              <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={params.categoryId ?? ""} name="categoryId">
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              From
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={params.from} name="from" type="date" />
            </label>
            <label className="text-sm font-medium">
              To
              <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={params.to} name="to" type="date" />
            </label>
            <div className="flex items-end gap-3">
              <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700" type="submit">
                Apply filters
              </button>
              <Link className="text-sm font-medium text-emerald-700" href="/transactions">
                Clear
              </Link>
            </div>
          </form>
          {transactions.length === 0 ? (
            <p className="mt-6 rounded-md border border-dashed border-neutral-300 px-4 py-8 text-sm text-neutral-600">
              {Object.values(params).some(Boolean)
                ? "No transactions match these filters."
                : "No transactions yet. Add your first income or expense to get started."}
            </p>
          ) : (
            <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
              {transactions.map((transaction) => (
                <article className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between" key={transaction.id}>
                  <div className="min-w-0">
                    <p className="font-medium">{transaction.description || transaction.category.name}</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {transaction.category.name} · {transaction.occurredAt.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <p className={transaction.type === "EXPENSE" ? "font-semibold text-red-700" : "font-semibold text-emerald-700"}>
                    {formatAmount(transaction.amountInCents, transaction.type, user.profile?.currency)}
                  </p>
                  <div className="flex shrink-0 items-center gap-3 text-sm">
                    <Link className="font-medium text-emerald-700" href={`/transactions/${transaction.id}/edit`}>
                      Edit
                    </Link>
                    <form action={deleteTransactionAction}>
                      <input name="transactionId" type="hidden" value={transaction.id} />
                      <button className="font-medium text-red-700" type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}