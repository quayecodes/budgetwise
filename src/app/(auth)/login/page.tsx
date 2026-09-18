import Link from "next/link";

import { loginUser } from "@/server/auth/actions";
import { AuthShell } from "@/components/ui/auth-shell";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <AuthShell title="Welcome back" description="Sign in to continue managing your student budget.">
      {error ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form action={loginUser} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            className="form-control mt-2"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            className="form-control mt-2"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
          />
        </label>

        <button
          className="button-primary w-full"
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
    </AuthShell>
  );
}
