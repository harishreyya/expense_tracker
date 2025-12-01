
"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const defaultCategories = ["Groceries", "Utilities", "Transport", "Dining", "Entertainment", "Other"];

const quickAmounts = [200, 500, 1000, 2500];

export default function ExpenseForm() {
  const { data: session } = useSession();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [merchant, setMerchant] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [recurring, setRecurring] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageTone, setMessageTone] = useState("neutral"); 

  const completionRatio = useMemo(() => {
    let filled = 0;
    if (date) filled++;
    if (amount) filled++;
    if (category || newCategory) filled++;
    if (merchant) filled++;
    return filled / 4;
  }, [date, amount, category, newCategory, merchant]);

  function validate() {
    const e = {};
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) e.amount = "Enter a valid amount";
    if (!category && !newCategory) e.category = "Select or add a category";
    if (!date) e.date = "Select a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddCategory() {
    if (newCategory.trim()) {
      setCategory(newCategory.trim());
      setNewCategory("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setMessageTone("neutral");

    if (!session) {
      setMessage("Please sign in to add expenses.");
      setMessageTone("negative");
      return;
    }
    if (!validate()) return;

    const expenseObj = {
      date: new Date(date).toISOString(),
      amount: Number(amount),
      currency,
      category: category || newCategory,
      merchant: merchant || null,
      notes: notes || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      paymentMethod,
      recurring
    };

    try {
      setLoading(true);
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseObj),
        credentials: "same-origin"
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setMessage(err?.error || "Failed to save expense");
        setMessageTone("negative");
      } else {
        await res.json();
        setMessage("Expense saved and synced ✨");
        setMessageTone("positive");
        setAmount("");
        setMerchant("");
        setNotes("");
        setTags("");
        setCategory("");
        setNewCategory("");
        setRecurring(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error");
      setMessageTone("negative");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAmount(value) {
    setAmount(String(value));
  }

  function resetForm() {
    setAmount("");
    setMerchant("");
    setNotes("");
    setTags("");
    setCategory("");
    setNewCategory("");
    setRecurring(false);
    setErrors({});
    setMessage(null);
    setMessageTone("neutral");
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>Capture completeness</span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 to-emerald-400"
            style={{ width: `${Math.max(completionRatio * 100, 10)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
        <label className="group relative block text-xs">
          <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Date
          </span>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="peer block w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 peer-focus:text-sky-500">
              📅
            </div>
          </div>
          {errors.date && <div className="mt-1 text-[11px] text-rose-500">{errors.date}</div>}
        </label>

        <div className="space-y-1.5">
          <label className="group relative block text-xs">
            <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Amount
            </span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-2 py-1.5 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-8 rounded-xl bg-transparent px-2 text-xs font-medium text-slate-600 outline-none"
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
              <input
                inputMode="numeric"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-8 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            {errors.amount && <div className="mt-1 text-[11px] text-rose-500">{errors.amount}</div>}
          </label>

          <div className="flex flex-wrap gap-1.5">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmount(val)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 shadow-sm transition hover:border-sky-400 hover:text-sky-700"
              >
                +{currency} {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-slate-50/80 p-3">
        <label className="block text-xs">
          <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Category
          </span>
          <div className="mt-0.5 flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">Select</option>
              {defaultCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div className="flex flex-1 gap-2">
              <input
                placeholder="Or type a new one"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:shadow-md active:scale-[0.98]"
              >
                Add
              </button>
            </div>
          </div>
          {errors.category && <div className="mt-1 text-[11px] text-rose-500">{errors.category}</div>}
        </label>

        <div className="flex flex-wrap gap-1.5">
          {defaultCategories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={
                  "rounded-full border px-2.5 py-1 text-[11px] transition " +
                  (active
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-700")
                }
              >
                {c}
              </button>
            );
          })}
        </div>

        <label className="block text-xs">
          <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Merchant / place
          </span>
          <input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Swiggy, Metro, Zomato"
            className="mt-0.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <label className="block text-xs">
          <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Notes
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional context like 'shared with friends', 'work travel', etc."
            className="mt-0.5 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            rows={3}
          />
        </label>

        <div className="space-y-3 text-xs">
          <label className="block">
            <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Tags
            </span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="weekend, work, recurring"
              className="mt-0.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Payment method
            </span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-0.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
            </select>
          </label>

          <label className="mt-1 flex items-center gap-2">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-[11px] text-slate-600">
              Mark as recurring (subscription, rent, etc.)
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Saving..." : "Save expense"}
        </motion.button>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Reset
        </button>

        <div className="ml-auto flex flex-col items-end gap-1 text-[11px] text-slate-500">
          <span>{session ? `Signed in as ${session.user?.email}` : "Not signed in"}</span>
          {message && (
            <span
              className={
                "inline-flex items-center rounded-full px-3 py-1 text-[11px] " +
                (messageTone === "positive"
                  ? "bg-emerald-50 text-emerald-700"
                  : messageTone === "negative"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-50 text-slate-600")
              }
            >
              {message}
            </span>
          )}
        </div>
      </div>
    </motion.form>
  );
}
