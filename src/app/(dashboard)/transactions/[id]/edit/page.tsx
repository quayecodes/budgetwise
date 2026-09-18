import { notFound } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { DashboardShell } from "@/components/ui/dashboard-shell";
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
    <DashboardShell title="Edit transaction" action={{ href: "/transactions", label: "Back to transactions" }}>
      {error ? (
        <div className="mx-auto mt-6 max-w-xl"><Alert>{error}</Alert></div>
      ) : null}
      <form action={updateTransactionAction} className="surface mx-auto mt-8 max-w-xl space-y-4 p-5 sm:p-6">
        <input name="transactionId" type="hidden" value={transaction.id} />
        <label className="block text-sm font-medium">
          Type
          <select className="form-control mt-2" name="type" defaultValue={transaction.type}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Amount
          <input className="form-control mt-2" defaultValue={(transaction.amountInCents / 100).toFixed(2)} name="amount" type="text" inputMode="decimal" required />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select className="form-control mt-2" name="categoryId" defaultValue={transaction.categoryId} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.type === "EXPENSE" ? "Expense" : "Income"}: {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Date
          <input className="form-control mt-2" defaultValue={transaction.occurredAt.toISOString().slice(0, 10)} name="occurredAt" type="date" required />
        </label>
        <label className="block text-sm font-medium">
          Note
          <input className="form-control mt-2" defaultValue={transaction.description} name="description" type="text" maxLength={200} />
        </label>
        <button className="button-primary w-full" type="submit">
          Save changes
        </button>
      </form>
    </DashboardShell>
  );
}