import Link from "next/link";

import { registerUser } from "@/server/auth/actions";
import { AuthShell } from "@/components/ui/auth-shell";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <AuthShell title="Create your account" description="Set up a secure account before adding transactions and budgets.">
      {error ? (
        <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form action={registerUser} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Full name</span>
          <input
            className="form-control mt-2"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
          />
        </label>

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
            autoComplete="new-password"
            required
            minLength={8}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Confirm password</span>
          <input
            className="form-control mt-2"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </label>

        <button
          className="button-primary w-full"
          type="submit"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-neutral-600">
        Already have an account?{" "}
        <Link className="font-medium text-emerald-700 hover:text-emerald-800" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
