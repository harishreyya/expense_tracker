"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses/breakdown", label: "Breakdown" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/" || pathname.startsWith("/dashboard");
  }
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const activeNavItem = navItems.find((item) => isActive(pathname, item.href)) ?? navItems[0];

  return (
    <header className="sticky top-0 z-40 bg-transparent">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-1] flex justify-center">
        <div className="h-20 w-[60%] max-w-3xl rounded-full bg-gradient-to-r from-sky-500/25 via-emerald-400/25 to-sky-500/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-3 md:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur-lg md:px-4 md:py-2.5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500 opacity-70" />

          <div className="flex items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="group relative flex items-center gap-2 rounded-2xl px-1 py-1 transition"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/60">
                  <span className="text-lg font-semibold">₹</span>
                  <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-sky-500/20 blur-md opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="hidden flex-col leading-tight md:flex">
                  <span className="text-[13px] font-semibold tracking-tight text-slate-900">
                    Expense Tracker
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Crafted insights, beautiful control
                  </span>
                </div>
              </Link>

              <motion.div
                key={activeNavItem.href}
                initial={{ opacity: 0, x: -6, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="hidden items-center gap-1 rounded-full bg-slate-900 text-[11px] text-slate-100 shadow-sm ring-1 ring-slate-800/70 md:inline-flex"
              >
                <span className="ml-2 flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="px-2 py-1">
                  Now viewing <span className="font-medium">{activeNavItem.label}</span>
                </span>
              </motion.div>
            </div>

            <LayoutGroup>
              <nav className="hidden items-center gap-1 rounded-2xl bg-slate-50/80 px-1 py-1 text-xs md:flex">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.div
                      key={item.href}
                      className="relative"
                      layout
                      transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.6 }}
                    >
                      <Link
                        href={item.href}
                        className={
                          "relative z-[1] flex items-center gap-1 rounded-2xl px-3 py-1.5 transition " +
                          (active
                            ? "text-slate-900"
                            : "text-slate-600 hover:text-slate-900 hover:shadow-sm")
                        }
                      >
                        <span>{item.label}</span>
                      </Link>
                      {active && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-2xl bg-white shadow-sm ring-1 ring-sky-500/50"
                          transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.6 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </nav>
            </LayoutGroup>

            <div className="flex items-center gap-2 md:gap-3">
              {status === "authenticated" && session?.user && (
                <div className="hidden flex-col items-end text-right text-[11px] leading-tight text-slate-600 sm:flex">
                  <span className="max-w-[160px] truncate text-[12px] font-medium text-slate-900">
                    {session.user.name ?? session.user.email}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Synced & secure
                  </span>
                </div>
              )}

              {status === "authenticated" ? (
                <motion.button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Sign out</span>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  className="hidden items-center gap-1 rounded-2xl bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 shadow-sm transition hover:bg-slate-950 md:inline-flex"
                  whileTap={{ scale: 0.97 }}
                >
                    <Link href="/auth">
                  <span>Sign in</span>
                  </Link>
                </motion.button>
              )}

              {status === "authenticated" && (
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] text-emerald-300 shadow-sm md:hidden">
                  <span>●</span>
                </div>
              )}

              <motion.button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Toggle main navigation"
                aria-expanded={open}
                whileTap={{ scale: 0.96 }}
              >
                <span className="sr-only">Toggle navigation</span>
                <div className="relative h-3.5 w-4">
                  <span
                    className={
                      "absolute left-0 top-0 block h-[2px] w-full rounded-full bg-slate-700 transition-transform " +
                      (open ? "translate-y-[7px] rotate-45" : "")
                    }
                  />
                  <span
                    className={
                      "absolute left-0 top-1/2 block h-[2px] w-full -translate-y-1/2 rounded-full bg-slate-700 transition-opacity " +
                      (open ? "opacity-0" : "opacity-100")
                    }
                  />
                  <span
                    className={
                      "absolute bottom-0 left-0 block h-[2px] w-full rounded-full bg-slate-700 transition-transform " +
                      (open ? "-translate-y-[7px] -rotate-45" : "")
                    }
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="mx-auto mt-2 w-full max-w-6xl px-4 md:hidden"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 py-2 text-sm shadow-[0_18px_40px_rgba(15,23,42,0.22)] backdrop-blur">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={
                        "relative flex items-center justify-between gap-2 px-3 py-2.5 transition " +
                        (active
                          ? "bg-slate-900 text-slate-50"
                          : "text-slate-700 hover:bg-slate-50")
                      }
                    >
                      <span className="text-[13px]">{item.label}</span>
                      {active && (
                        <span className="text-[10px] uppercase tracking-[0.12em] text-sky-300">
                          Active
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2">
                <div className="flex items-center justify-between gap-2 px-3">
                  {status === "authenticated" && session?.user ? (
                    <>
                      <div className="flex flex-col text-[11px] text-slate-600">
                        <span className="max-w-[180px] truncate font-medium text-slate-900">
                          {session.user.name ?? session.user.email}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Signed in
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        signIn(undefined, { callbackUrl: "/dashboard" });
                      }}
                      className="ml-auto rounded-2xl bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 shadow-sm hover:bg-slate-950"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
