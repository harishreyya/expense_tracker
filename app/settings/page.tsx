import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import Link from "next/link";

export default async function Settings() {
  const session = await getServerSession(authOptions as any);
  {/* @ts-ignore */}
  if (!session?.user?.email) {
    return (
      <main className="relative min-h-screen bg-slate-50 px-4 pb-12 pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
          <div className="h-24 w-[70%] max-w-2xl rounded-full bg-gradient-to-r from-sky-500/15 via-emerald-400/15 to-sky-500/15 blur-3xl" />
        </div>
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-3xl border border-slate-200/80 bg-white/95 px-6 py-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-50 shadow-sm ring-1 ring-slate-800/80">
            <span className="text-lg font-semibold">⚙️</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            You&apos;re almost there
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your personal settings, appearance preferences, and account controls.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-950 hover:shadow-md"
            >
              Go to sign in
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
      // @ts-ignore 
    where: { email: session?.user?.email }
  });

  const initials = (() => {
    if (user?.name && typeof user.name === "string") {
      return user.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
// @ts-ignore
    if (session?.user?.email) {
      // @ts-ignore
      return session?.user?.email.slice(0, 2).toUpperCase();
    }
    return "US"; 
  })();


  return (
    <main className="relative min-h-screen bg-slate-50 px-4 pb-12 pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
        <div className="h-24 w-[70%] max-w-3xl rounded-full bg-gradient-to-r from-sky-500/15 via-emerald-400/15 to-sky-500/15 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.14)] sm:p-6 md:p-7">
          <div className="pointer-events-none absolute -left-16 top-0 h-28 w-28 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-50 shadow-sm ring-1 ring-slate-800/80">
                <span className="text-base font-semibold">{initials}</span>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/30 blur-md opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  Settings
                </h1>
                <p className="text-[11px] text-slate-500">
                  Tune how your expense experience looks and feels. Your profile stays private and
                  secure.
                </p>
              </div>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 md:justify-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Signed in as
                <span className="max-w-[180px] truncate font-medium text-slate-800">
                  {/* @ts-ignore */}
                  {user?.email ?? session?.user?.email}
                </span>
              </span>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 shadow-sm transition hover:bg-slate-950"
              >
                <span>Back to dashboard</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm sm:p-5">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Basic identity used across your dashboards and AI-powered summaries.
                  </p>
                </div>
                <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] text-slate-500 ring-1 ring-slate-100">
                  Read-only for now
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Name
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900">
                    {user?.name || "—"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                    Email
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Need to change your email or name? Use your authentication provider (Google) or
                contact support to update your primary identity.
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 text-slate-50 shadow-sm">
              <div className="pointer-events-none absolute -right-16 top-[-8px] h-32 w-32 rounded-full bg-sky-500/30 blur-3xl" />
              <div className="pointer-events-none absolute -left-14 bottom-[-10px] h-32 w-32 rounded-full bg-emerald-400/25 blur-3xl" />

              <div className="relative px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">Appearance preview</h2>
                    <p className="mt-1 text-[11px] text-slate-300">
                      A glimpse of how your dashboards feel — light vs dark, accent hints, and card
                      density.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-2 py-1 text-[10px] text-slate-300 ring-1 ring-slate-700">
                    Coming soon
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-slate-50/10 px-3 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-slate-500/60"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Auto theme
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-slate-600/80"
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-slate-600/80"
                  >
                    Dark
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-slate-900/70 p-3 ring-1 ring-slate-700/80">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-xl bg-slate-800/80" />
                    <div className="flex-1">
                      <div className="h-2.5 w-28 rounded-full bg-slate-700" />
                      <div className="mt-1 h-2 w-20 rounded-full bg-slate-800" />
                    </div>
                    <div className="h-7 w-16 rounded-full bg-sky-500/70" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-16 flex-1 rounded-2xl bg-slate-800/80" />
                    <div className="h-16 flex-1 rounded-2xl bg-slate-800/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm sm:p-5">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-slate-900 via-sky-500 to-slate-900" />
              <h2 className="text-sm font-semibold text-slate-900">Account security</h2>
              <p className="mt-1 text-[11px] text-slate-500">
                You&apos;re signed in via NextAuth. Authentication and session handling are managed
                securely for you.
              </p>

              <div className="mt-3 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                  <span>Primary login</span>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-slate-50">
                    Email / Google
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                  <span>Session status</span>
                  <span className="inline-flex items-center gap-1 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                For account deletion or data export, surface these controls in a future step under a{" "}
                <span className="font-medium text-slate-700">Privacy &amp; data</span> section.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-100/80 p-4 text-[11px] text-slate-600 shadow-sm">
              <h3 className="text-xs font-semibold text-slate-800">Small note</h3>
              <p className="mt-1">
                Settings here are intentionally minimal to keep your focus on tracking and
                understanding expenses. As the product grows, this space is ready for notification
                controls, AI preferences, export formats, and more.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
