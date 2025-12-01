
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AnalyticsPieCharts from "@/components/AnalyticsPieCharts";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ExpenseRow {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  category: string;
  paymentMethod: string | null;
}

function buildCategorySeries(expenses: ExpenseRow[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const key = e.category || "Uncategorized";
    map.set(key, (map.get(key) ?? 0) + e.amount);
  }
  const labels = Array.from(map.keys());
  const values = labels.map((l) => map.get(l) ?? 0);
  return { labels, values };
}

function buildMonthlySeries(expenses: ExpenseRow[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const label = e.date.toLocaleDateString("en-IN", {
      year: "2-digit",
      month: "short"
    });
    map.set(label, (map.get(label) ?? 0) + e.amount);
  }
  const labels = Array.from(map.keys());
  const values = labels.map((l) => map.get(l) ?? 0);
  return { labels, values };
}

function prettyPaymentMethod(value: string | null): string {
  if (!value) return "Unknown";
  const lower = value.toLowerCase();
  if (lower === "upi") return "UPI";
  if (lower === "card") return "Card";
  if (lower === "cash") return "Cash";
  if (lower === "wallet") return "Wallet";
  return value;
}

function buildPaymentMethodSeries(expenses: ExpenseRow[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const key = prettyPaymentMethod(e.paymentMethod);
    map.set(key, (map.get(key) ?? 0) + e.amount);
  }
  const labels = Array.from(map.keys());
  const values = labels.map((l) => map.get(l) ?? 0);
  return { labels, values };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  if (!session?.user?.email) {
    return (
      <main className="min-h-screen px-4 pb-10 pt-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white/90 p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-900">You are not signed in</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please{" "}
            <Link href="/auth" className="font-medium text-sky-600 underline">
              sign in
            </Link>{" "}
            to view analytics.
          </p>
        </div>
      </main>
    );
  }

  // Last 12 months analytics
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // @ts-ignore
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const rawExpenses = user
    ? await prisma.expense.findMany({
        where: {
          userId: user.id,
          date: { gte: twelveMonthsAgo }
        },
        orderBy: { date: "asc" }
      })
    : [];

  const expenses: ExpenseRow[] = rawExpenses.map((e: any) => ({
    id: e.id,
    date: e.date,
    amount: e.amount,
    currency: e.currency,
    category: e.category,
    paymentMethod: e.paymentMethod
  }));

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categorySeries = buildCategorySeries(expenses);
  const monthlySeries = buildMonthlySeries(expenses);
  const paymentMethodSeries = buildPaymentMethodSeries(expenses);
  const baseCurrency = expenses[0]?.currency ?? "INR";

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {/* Ambient halo */}
        <div className="pointer-events-none absolute inset-x-0 top-14 flex justify-center">
          <div className="h-24 w-[70%] max-w-4xl rounded-full bg-gradient-to-r from-emerald-400/18 via-sky-500/18 to-emerald-400/18 blur-3xl" />
        </div>

        {/* Hero header */}
        <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.12)] sm:p-5 md:p-6">
          <div className="pointer-events-none absolute -left-14 -bottom-10 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-sky-100 ring-1 ring-slate-800/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>High-level insights · Pie-only view</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Analytics
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Visualize how your spending distributes across categories, months, and payment
                methods for the last 12 months.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                ⬅ Back to dashboard
              </Link>
              <Link
                href="/expenses/breakdown"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-950"
              >
                Expenses breakdown
              </Link>
            </div>
          </div>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-4 text-slate-50 shadow-md ring-1 ring-slate-800/70">
            <div className="pointer-events-none absolute -right-8 -top-6 h-20 w-20 rounded-full bg-sky-500/40 blur-xl" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              Total spent · 12 months
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalAmount > 0 ? `${baseCurrency} ${totalAmount.toFixed(2)}` : "—"}
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              A full-year sweep to understand your overall burn rate.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Transactions
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{expenses.length}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              The number of data points shaping your insights.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Avg. per transaction
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {expenses.length > 0
                ? `${baseCurrency} ${(totalAmount / expenses.length).toFixed(2)}`
                : "—"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Quick sense of the &quot;size&quot; of an average spend across the year.
            </p>
          </div>
        </section>

        {/* Charts shell */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-md sm:p-5">
          <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Pie-only analytics
              </p>
              <p className="text-[11px] text-slate-500">
                Three focused pies: category share, month distribution, and payment channels.
              </p>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500 sm:inline-flex">
              Hover segments to see details · no tables here, just pure visual weight.
            </div>
          </div>

          <AnalyticsPieCharts
            categorySeries={categorySeries}
            monthlySeries={monthlySeries}
            paymentMethodSeries={paymentMethodSeries}
          />
        </section>
      </div>
    </main>
  );
}
