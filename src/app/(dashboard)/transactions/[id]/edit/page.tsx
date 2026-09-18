import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/server/auth/session";
import { ensureDefaultCategories, listCategories } from "@/server/transactions/repository";
import { getTransactionForEdit } from "@/server/transactions/service";
import { updateTransactionAction } from "@/server/transactions/actions";

type EditTransactionPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditTransactionPage({ params, searchParams }: EditTransactionPageProps) {
  const user = await requireUser();
  const { id } = await params;
  await ensureDefaultCategories(user.id);
  const [transaction, categories, { error }] = await Promise.all([
    getTransactionForEdit(user.id, id),
    listCategories(user.id),
    searchParams,
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-6 py-8">
      <Link className="text-sm font-medium text-emerald-700" href="/transactions">
        Back to transactions
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Edit transaction</h1>
      {error ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <form action={updateTransactionAction} className="mt-8 space-y-4">
        <input name="transactionId" type="hidden" value={transaction.id} />
        <label className="block text-sm font-medium">
          Type
          <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="type" defaultValue={transaction.type}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Amount
          <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={(transaction.amountInCents / 100).toFixed(2)} name="amount" type="text" inputMode="decimal" required />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" name="categoryId" defaultValue={transaction.categoryId} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.type === "EXPENSE" ? "Expense" : "Income"}: {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Date
          <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={transaction.occurredAt.toISOString().slice(0, 10)} name="occurredAt" type="date" required />
        </label>
        <label className="block text-sm font-medium">
          Note
          <input className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={transaction.description} name="description" type="text" maxLength={200} />
        </label>
        <button className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" type="submit">
          Save changes
        </button>
      </form>
    </main>
  );
}