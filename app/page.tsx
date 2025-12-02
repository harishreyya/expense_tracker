"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-10 pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-15%] h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute right-[-10%] top-[25%] h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-80 w-80 rounded-full bg-sky-600/10 blur-3xl" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(56,189,248,0.18) 0, transparent 55%)," +
            "radial-gradient(circle at bottom, rgba(16,185,129,0.16) 0, transparent 55%)," +
            "linear-gradient(to bottom, #020617, #020617)"
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 ring-1 ring-slate-700/90">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400/90 text-[9px]">
              ●
            </span>
            <span className="hidden sm:inline">
              Built with Next.js, Prisma, Tailwind, NextAuth &amp; OpenAI
            </span>
            <span className="sm:hidden">Next.js · Prisma · OpenAI</span>
          </div>
          <span className="hidden sm:inline text-[10px] text-slate-500">
            Designed to feel like a private, calm command centre for your money.
          </span>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] text-slate-200 ring-1 ring-slate-700/90">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>Expense Tracker · Personal Finance Canvas</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
                A calmer way to
                <span className="block bg-gradient-to-r from-sky-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
                  see where your money goes.
                </span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                Not just charts. A thoughtfully crafted workspace for your daily spending:
                interactive dashboard, breakdown views, and AI-powered insights, all in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:bg-sky-400 hover:shadow-[0_14px_36px_rgba(56,189,248,0.55)]"
              >
                Open dashboard
                <span className="ml-1.5 text-[13px]">↗</span>
              </Link>

              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
              >
                Sign in / Sign up
              </Link>

              <span className="text-[11px] text-slate-500">
                No noise, no ads &mdash; just your numbers, beautifully organised.
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 ring-1 ring-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Smart breakdowns
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 ring-1 ring-slate-700">
                AI-powered recommendations
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 ring-1 ring-slate-700">
                Daily &amp; monthly charts
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -right-4 -top-6 h-24 w-24 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-[-14px] h-28 w-28 rounded-full bg-emerald-400/25 blur-3xl" />

            <div className="relative space-y-3 rounded-[1.8rem] border border-slate-700/80 bg-slate-950/70 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-5">
              <Link
                href="/dashboard"
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/90 p-3 ring-1 ring-slate-700/90 transition hover:ring-sky-500/70"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-sky-300 ring-1 ring-slate-700">
                  <span className="text-lg">📊</span>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/40 opacity-0 blur-md transition group-hover:opacity-100" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-50">Interactive dashboard</p>
                    <span className="text-[11px] text-slate-400 group-hover:text-sky-300">
                      Open
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Today&apos;s spend, streaks, and charts in one at-a-glance canvas.
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/expenses/breakdown"
                  className="group flex flex-col justify-between rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-700/80 transition hover:ring-emerald-400/80"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-50">Breakdown view</p>
                    <span className="text-[11px] text-emerald-300">Table-first</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Filter by day, month, category and payment method.
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    <span className="h-7 flex-1 rounded-xl bg-slate-800" />
                    <span className="h-7 w-7 rounded-xl bg-slate-800" />
                  </div>
                </Link>

                <Link
                  href="/analytics"
                  className="group flex flex-col justify-between rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-700/80 transition hover:ring-sky-400/80"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-50">Analytics</p>
                    <span className="text-[11px] text-sky-300">Pie-only</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Category, monthly, and payment mix &mdash; visualised.
                  </p>
                  <div className="mt-3 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full border border-slate-700 bg-slate-900" />
                  </div>
                </Link>
              </div>

              <Link
                href="/auth"
                className="group mt-1 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/70 px-3 py-2.5 text-[11px] text-slate-300 ring-1 ring-slate-700/80 transition hover:bg-slate-900 hover:ring-sky-500/80"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-slate-800 text-[13px]">
                    🔐
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-100">Sign in securely</span>
                    <span className="text-[10px] text-slate-400">
                      Email/password or Google via NextAuth.
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 group-hover:text-sky-300">
                  Continue
                </span>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-[11px] text-slate-500">
          <p>
            Crafted to be your{" "}
            <span className="font-medium text-slate-300">daily money companion</span>, not just
            another spreadsheet.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 ring-1 ring-slate-700">
              Next.js App Router · TypeScript · Prisma (MongoDB)
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
