"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/dashboard"
      });
      // @ts-ignore
      if (res?.error) setError("Unable to sign in. Please check your details.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" /> 
         <div className="absolute right-[-10%] top-[25%] h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" /> 
         <div className="absolute bottom-[-10%] left-[20%] h-80 w-80 rounded-full bg-sky-600/10 blur-3xl" />
      </div>

 
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0,_transparent_55%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.8),rgba(15,23,42,0.9))]" />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-4xl flex-col gap-6 rounded-[1.8rem] border border-slate-800/70 bg-slate-950/70 p-4 shadow-[0_32px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-6 lg:flex-row lg:gap-10 lg:p-8"
      >
      
        <div className="flex flex-1 flex-col justify-between gap-6 border-b border-slate-800/60 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-medium text-slate-100 ring-1 ring-slate-700">
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400/90 text-[9px]">
                ●
              </span>
              <span>Secure personal finance workspace</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-50 ring-1 ring-slate-700">
                <span className="text-xl font-semibold">₹</span>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/30 blur-md opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="space-y-1">
                <h1 className="text-base font-semibold tracking-tight text-slate-50 sm:text-lg">
                  Expense Tracker
                </h1>
                <p className="text-[11px] text-slate-400">
                  Log in to a calm, focused view of your money &mdash; built for everyday clarity.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden gap-2 text-[11px] text-slate-400 sm:flex">
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] ring-1 ring-slate-700">
              Encrypted sessions
            </span>
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] ring-1 ring-slate-700">
              Google sign-in ready
            </span>
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] ring-1 ring-slate-700">
              Built for multi-device dashboards
            </span>
          </div>
        </div>

      
        <div className="flex flex-1 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
            className="relative w-full rounded-[1.6rem] bg-slate-950/80 p-4 ring-1 ring-slate-800/80 sm:p-5"
          >
     
            <div className="pointer-events-none absolute inset-x-5 top-0 h-[2px] bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500" />

            <header className="mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
                Welcome back
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Sign in to continue tracking, analysing, and understanding your spending habits.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400"
                  >
                    Email
                  </label>
                  <span className="text-[10px] text-slate-500">Use your primary login email</span>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                    placeholder="you@example.com"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-slate-500 peer-focus:text-sky-400">
                    ✉️
                  </span>
                </div>
              </div>

       
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[10px] text-sky-400 hover:text-sky-300"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-500 hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              {error && (
                <div className="rounded-2xl bg-rose-950/60 px-3 py-2 text-[11px] text-rose-100 ring-1 ring-rose-500/50">
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="flex w-full items-center justify-center rounded-2xl bg-sky-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing you in…" : "Sign in"}
              </motion.button>
            </form>

            <div className="my-4 flex items-center gap-3 text-[11px] text-slate-500">
              <div className="h-px flex-1 bg-slate-800" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm font-medium text-slate-50 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px]">
                G
              </span>
              <span>Sign in with Google</span>
            </motion.button>

            <div className="mt-4 flex flex-col gap-1 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-slate-500">
                New here?{" "}
                <span className="text-slate-300">
                  You&apos;ll get access to dashboards tuned to your spending.
                </span>
              </span>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Security & account settings</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
