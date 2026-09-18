import Link from "next/link";

import { loginUser } from "@/server/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <p className="text-sm font-medium text-emerald-700">BudgetWise</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Sign in to continue managing your student budget.
      </p>

      {error ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form action={loginUser} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
          />
        </label>

        <button
          className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          type="submit"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-600">
        New here?{" "}
        <Link className="font-medium text-emerald-700 hover:text-emerald-800" href="/register">
          Create an account
        </Link>
      </p>
    </main>
  );
}
