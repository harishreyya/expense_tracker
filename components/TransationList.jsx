"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function TransactionList({ transactions = [] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-2xl bg-slate-50/80 text-sm text-slate-500">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[15px] text-slate-50 shadow-sm">
          ₹
        </div>
        <p className="text-sm font-medium text-slate-700">No transactions yet</p>
        <p className="text-xs text-slate-500">
          Add a few expenses and this feed will become your daily pulse.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      <AnimatePresence initial={false}>
        {transactions.map((tx, index) => {
          const amount = Number(tx.amount ?? 0);
          const isDebit = amount > 0;
          const currency = tx.currency ?? "INR";
          const displayAmount = `${currency} ${amount.toFixed(2)}`;
          const date = tx.date ? new Date(tx.date) : null;
          const isFirst = index === 0;

          return (
            <motion.li
              key={tx.id ?? index}
              layout
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="relative flex items-stretch gap-3 rounded-2xl bg-slate-50/80 px-3 py-2.5 shadow-sm ring-1 ring-slate-100 hover:bg-white hover:shadow-md hover:ring-sky-100"
            >
              <div className="relative flex flex-col items-center pt-1">
                {!isFirst && (
                  <span className="absolute -top-4 h-4 w-px bg-slate-200" aria-hidden="true" />
                )}
                <span
                  className={`flex h-2.5 w-2.5 items-center justify-center rounded-full border shadow-sm ${
                    isDebit
                      ? "border-rose-200 bg-rose-50"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isDebit ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                </span>
              </div>

              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                      {tx.merchant || tx.category || "Unlabeled transaction"}
                    </p>
                    {tx.category && (
                      <span className="inline-flex max-w-[120px] truncate rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {tx.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    {date && (
                      <span>
                        {date.toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </span>
                    )}
                    {tx.paymentMethod && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        {String(tx.paymentMethod).toUpperCase()}
                      </span>
                    )}
                    {Array.isArray(tx.tags) && tx.tags.length > 0 && (
                      <span className="inline-flex max-w-[140px] items-center gap-1 truncate text-[10px] text-slate-400">
                        <span className="text-xs">#</span>
                        <span className="truncate">{tx.tags.slice(0, 2).join(", ")}</span>
                        {tx.tags.length > 2 && <span>+{tx.tags.length - 2}</span>}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div
                    className={
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 " +
                      (isDebit
                        ? "bg-rose-50 text-rose-600 ring-rose-100"
                        : "bg-emerald-50 text-emerald-600 ring-emerald-100")
                    }
                  >
                    <span>{displayAmount}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {isDebit ? "Money out" : "Money in"}
                  </span>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
