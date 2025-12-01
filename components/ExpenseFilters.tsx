"use client";

import { motion } from "framer-motion";

export type ExpenseFilterValues = {
  from?: string;
  to?: string;
  category?: string;
  paymentMethod?: string;
  minAmount?: string;
  maxAmount?: string;
};

interface ExpenseFiltersProps {
  initialValues: ExpenseFilterValues;
}

const paymentMethods = [
  { value: "", label: "All payment methods" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "wallet", label: "Wallet" }
];

export default function ExpenseFilters({ initialValues }: ExpenseFiltersProps) {
  return (
    <motion.form
      method="GET"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-lg sm:p-5"
    >
      <div className="pointer-events-none absolute -left-12 -top-10 h-24 w-24 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-100 ring-1 ring-slate-800/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Precision filters</span>
          </div>
          <h2 className="mt-2 text-sm font-semibold tracking-tight text-slate-900">
            Shape the view you want
          </h2>
          <p className="text-[11px] text-slate-500">
            Combine date, category, payment, and amount to create your own slice of spending.
          </p>
        </div>

        <div className="hidden flex-col items-end text-[10px] text-slate-500 sm:flex">
          <span>Filters are URL-based – share the link to share the exact view.</span>
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-1 flex flex-col gap-2 rounded-2xl bg-slate-50/70 p-3 ring-1 ring-slate-100 md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Date range
            </label>
            <span className="text-[10px] text-slate-400">From · To</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>From</span>
              </div>
              <div className="relative mt-1">
                <input
                  id="from"
                  name="from"
                  type="date"
                  defaultValue={initialValues.from}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-slate-400">
                  📅
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>To</span>
              </div>
              <div className="relative mt-1">
                <input
                  id="to"
                  name="to"
                  type="date"
                  defaultValue={initialValues.to}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-slate-400">
                  📅
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl bg-slate-50/60 p-3 ring-1 ring-slate-100">
          <label
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
            htmlFor="category"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Groceries, Dining"
            defaultValue={initialValues.category}
            className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <div className="mt-1 flex flex-wrap gap-1.5">
            {["Groceries", "Dining", "Transport"].map((c) => (
              <span
                key={c}
                className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500 ring-1 ring-slate-100"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl bg-slate-50/60 p-3 ring-1 ring-slate-100">
          <label
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
            htmlFor="paymentMethod"
          >
            Payment
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            defaultValue={initialValues.paymentMethod ?? ""}
            className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            {paymentMethods.map((pm) => (
              <option key={pm.value} value={pm.value}>
                {pm.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-slate-400">
            Filter by how you paid: UPI, card, cash, wallet.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl bg-slate-50/60 p-3 ring-1 ring-slate-100">
          <label
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
            htmlFor="minAmount"
          >
            Min amount
          </label>
          <div className="mt-0.5 flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
            <span className="text-[11px] text-slate-400">≥</span>
            <input
              id="minAmount"
              name="minAmount"
              type="number"
              step="0.01"
              defaultValue={initialValues.minAmount}
              placeholder="0"
              className="h-7 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl bg-slate-50/60 p-3 ring-1 ring-slate-100">
          <label
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
            htmlFor="maxAmount"
          >
            Max amount
          </label>
          <div className="mt-0.5 flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
            <span className="text-[11px] text-slate-400">≤</span>
            <input
              id="maxAmount"
              name="maxAmount"
              type="number"
              step="0.01"
              defaultValue={initialValues.maxAmount}
              placeholder="∞"
              className="h-7 flex-1 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Filters update the URL – perfect for bookmarks and sharing.</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-950 hover:shadow-md"
          >
            Apply filters
          </motion.button>
          <a
            href="/expenses/breakdown"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Reset
          </a>
        </div>
      </div>
    </motion.form>
  );
}
