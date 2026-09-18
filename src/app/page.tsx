import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <section>
        <p className="text-sm font-medium tracking-wide text-emerald-700">BudgetWise</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Student personal finance, clearly.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8">
          The app now has secure account access. Sign in or create an account to reach your
          protected student finance dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            href="/register"
          >
            Create account
          </Link>
          <Link
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-500"
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
