import Link from "next/link";

import { requireUser } from "@/server/auth/session";
import { updateProfilePreferencesAction } from "@/server/profile/actions";
import { supportedCurrencies } from "@/server/profile/validation";

type SettingsPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const timezoneOptions = [
  "UTC",
  "Africa/Lagos",
  "America/New_York",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Paris",
];

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const profile = user.profile ?? { currency: "USD", timezone: "UTC" };

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-8">
      <header className="border-b border-neutral-200 pb-6">
        <Link className="text-sm font-medium text-emerald-700" href="/dashboard">
          BudgetWise
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Profile settings</h1>
        <p className="mt-2 text-sm text-neutral-600">Choose how amounts and dates are shown in your workspace.</p>
      </header>

      <section className="py-8">
        {params.error ? (
          <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </p>
        ) : null}
        {params.saved ? (
          <p className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Preferences saved.
          </p>
        ) : null}
        <form action={updateProfilePreferencesAction} className="max-w-md space-y-5">
          <label className="block text-sm font-medium">
            Currency
            <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={profile.currency} name="currency">
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency === "GHS" ? "GHS - Ghanaian cedi" : currency}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Timezone
            <select className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 font-normal" defaultValue={profile.timezone} name="timezone">
              {timezoneOptions.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </label>
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" type="submit">
            Save preferences
          </button>
        </form>
      </section>
    </main>
  );
}