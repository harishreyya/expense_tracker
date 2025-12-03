"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses/breakdown", label: "Breakdown" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" }
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname.startsWith("/dashboard");
  }
  return pathname.startsWith(href);
}

export default function Header() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "/";
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sky-300 shadow-[0_10px_30px_rgba(15,23,42,0.75)] ring-1 ring-slate-700">
            <span className="text-lg font-bold">₹</span>
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-sky-500/30 blur-md opacity-0 transition group-hover:opacity-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight tracking-tight text-slate-50">
              Expense Tracker
            </span>
            <span className="text-[11px] text-slate-400">
              Crafted insights, beautiful control
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 rounded-full bg-slate-900/70 px-1 py-1 text-sm ring-1 ring-slate-700 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full px-3 py-1.5 transition " +
                  (active
                    ? "bg-slate-50 text-slate-900 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-50")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {status === "authenticated" && session?.user && (
            <div className="hidden flex-col items-end text-right text-[11px] leading-tight text-slate-300 sm:flex">
              <span className="font-medium text-slate-50">
                {session.user.name ?? session.user.email}
              </span>
              <span className="text-[10px] text-slate-500">Signed in</span>
            </div>
          )}

          {status === "authenticated" ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 md:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              className="hidden rounded-2xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm transition hover:bg-sky-100 md:inline-flex"
            >
              <Link href="/auth">Sign in</Link>
            </button>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 shadow-sm md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle main navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-[5px]">
              <span
                className={
                  "block h-[2px] w-4 rounded-full bg-slate-200 transition-transform " +
                  (open ? "translate-y-[3.5px] rotate-45" : "")
                }
              />
              <span
                className={
                  "block h-[2px] w-4 rounded-full bg-slate-200 transition-opacity " +
                  (open ? "opacity-0" : "opacity-100")
                }
              />
              <span
                className={
                  "block h-[2px] w-4 rounded-full bg-slate-200 transition-transform " +
                  (open ? "-translate-y-[3.5px] -rotate-45" : "")
                }
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 text-sm shadow-lg md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={
                      "rounded-xl px-3 py-2 transition " +
                      (active
                        ? "bg-slate-50 text-slate-900"
                        : "text-slate-200 hover:bg-slate-900")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
                {status === "authenticated" && session?.user ? (
                  <>
                    <div className="flex flex-col text-[11px] text-slate-300">
                      <span className="max-w-[160px] truncate font-medium text-slate-50">
                        {session.user.name ?? session.user.email}
                      </span>
                      <span className="text-[10px] text-slate-500">Signed in</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-slate-800"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="ml-auto rounded-2xl bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-900 shadow-sm hover:bg-sky-100"
                  >
                    <Link href="/auth">Sign in</Link>
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
