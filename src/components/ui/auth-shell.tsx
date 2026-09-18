import Link from "next/link";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6 sm:py-12">
      <Link className="text-sm font-semibold tracking-wide text-emerald-700" href="/">
        BudgetWise
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
      {children}
    </main>
  );
}