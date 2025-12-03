import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseCharts from "../../components/ExpenseCharts";
import AIAssistantPanel from "../../components/AIAssistantPanel";

export const dynamic = "force-dynamic";

async function fetchExpenses(userId: string) {
  return prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" }
  });
}

type Expense = {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  category: string;
  merchant: string | null;
  paymentMethod: string | null;
};

function getDashboardStats(expenses: Expense[]) {
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let todayTotal = 0;
  let monthTotal = 0;
  let lastMonthTotal = 0;
  const categoryTotals = new Map<string, number>();

  for (const e of expenses) {
    const d = e.date;
    const keyDay = d.toISOString().slice(0, 10);
    const keyMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (keyDay === todayKey) {
      todayTotal += e.amount;
    }
    if (keyMonth === thisMonthKey) {
      monthTotal += e.amount;
    }

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    if (keyMonth === lastMonthKey) {
      lastMonthTotal += e.amount;
    }

    const cat = e.category || "Uncategorized";
    categoryTotals.set(cat, (categoryTotals.get(cat) ?? 0) + e.amount);
  }

  const topCategory = Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])[0];

  const avgPerTxn = expenses.length ? monthTotal / expenses.length : 0;
  const trend =
    lastMonthTotal === 0
      ? null
      : ((monthTotal - lastMonthTotal) / Math.max(lastMonthTotal, 1)) * 100;

  return {
    todayTotal,
    monthTotal,
    lastMonthTotal,
    avgPerTxn,
    topCategoryName: topCategory?.[0] ?? "—",
    topCategoryValue: topCategory?.[1] ?? 0,
    trend
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  if (!session?.user?.email) {
    return (
      <main className="min-h-screen px-4 pb-10 pt-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white/80 p-8 text-center shadow-xl">
          <h2 className="text-xl font-semibold text-slate-900">You are not signed in</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in to view your personalized expense dashboard.
          </p>
        </div>
      </main>
    );
  }

  // @ts-ignore
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email }});
  const rawExpenses = user ? await fetchExpenses(user?.id) : [];

  const expenses: Expense[] = rawExpenses.map((e: any) => ({
    id: e.id,
    date: e.date,
    amount: e.amount,
    currency: e.currency ?? "INR",
    category: e.category,
    merchant: e.merchant,
    paymentMethod: e.paymentMethod
  }));

  const stats = getDashboardStats(expenses);
  const baseCurrency = expenses[0]?.currency ?? "INR";

  const trendLabel =
    stats.trend == null
      ? "No previous month data"
      : `${stats.trend > 0 ? "↑" : "↓"} ${Math.abs(stats.trend).toFixed(1)}% vs last month`;

 const rawName = (user?.name ?? "").trim();
  // @ts-ignore
  const rawEmail = (session?.user?.email ?? "").trim();

  const hasName = rawName.length > 0;
  const displayLabel = hasName ? rawName : rawEmail || "there";
  const greetingPrefix = hasName ? "Welcome back," : "Welcome,";


  return (
    <main className="min-h-screen px-4 pb-10 pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
      
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-900 p-[1px] shadow-[0_18px_45px_rgba(15,23,42,0.65)]">
          <div className="relative flex flex-col gap-6 rounded-[1.45rem] bg-slate-900/80 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
     
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                {greetingPrefix}&nbsp;
                <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text font-semibold text-transparent">
                 {displayLabel}
                </span>
              </h1>
              <p className="max-w-xl text-sm text-slate-300">
                Your spending story at a glance. Track today, understand this month, and spot the
                patterns that actually matter.
              </p>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300 ring-1 ring-slate-700/60">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live sync enabled · Personal insights updated in real time
              </div>
            </div>

            <div className="relative flex min-w-[230px] flex-col gap-3 rounded-2xl bg-slate-900/80 px-4 py-4 text-sm text-slate-50 ring-1 ring-slate-700/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Today
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] text-slate-400">Spent so far</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-50">
                    {baseCurrency} {stats.todayTotal.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Top category</p>
                  <p className="mt-1 text-xs font-medium text-slate-100">
                    {stats.topCategoryName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {stats.topCategoryValue
                      ? `${baseCurrency} ${stats.topCategoryValue.toFixed(0)}`
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>This month</span>
                    <span>
                      {baseCurrency} {stats.monthTotal.toFixed(0)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 to-emerald-500 transition-all"
                      style={{
                        width: `${Math.min(
                          (stats.monthTotal / Math.max(stats.lastMonthTotal || stats.monthTotal || 1, 1)) *
                            60 +
                            20,
                          100
                        ).toFixed(0)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end text-[11px]">
                  <span className="text-slate-400">Trend</span>
                  <span
                    className={
                      "mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 " +
                      (stats.trend == null
                        ? "bg-slate-800 text-slate-300"
                        : stats.trend > 0
                        ? "bg-rose-500/10 text-rose-300"
                        : "bg-emerald-500/10 text-emerald-300")
                    }
                  >
                    <span className="text-[10px] font-medium">
                      {trendLabel}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-[2px] hover:shadow-lg">
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-sky-100 group-hover:bg-sky-200/80" />
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Month to date
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {baseCurrency} {stats.monthTotal.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Across {expenses.length} transactions this month.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-[2px] hover:shadow-lg">
            <div className="pointer-events-none absolute -left-4 -top-8 h-16 w-16 rounded-full bg-emerald-100 group-hover:bg-emerald-200/80" />
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Avg per transaction
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {expenses.length ? `${baseCurrency} ${stats.avgPerTxn.toFixed(2)}` : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              A quick sense of how heavy each spend typically is.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-4 text-slate-50 shadow-md ring-1 ring-slate-800/60 transition hover:-translate-y-[2px] hover:shadow-lg">
            <div className="pointer-events-none absolute -right-8 bottom-0 h-16 w-16 rounded-full bg-sky-500/40 blur-xl" />
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-200">
              Focus hint
            </p>
            <p className="mt-2 text-sm">
              Keep an eye on <span className="font-semibold">{stats.topCategoryName}</span>. Small
              tweaks there can shift your whole month.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-white/95 p-4 shadow-md ring-1 ring-slate-100 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Quick capture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Log a new expense in under 10 seconds.
                  </p>
                </div>
                <span className="hidden rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 sm:inline-flex">
                  ⌨︎ Keyboard-first friendly
                </span>
              </div>
              <div className="mt-4">
                <ExpenseForm />
              </div>
            </div>

            <section className="mt-6">
  <AIAssistantPanel/>
</section>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white/95 p-4 shadow-md ring-1 ring-slate-100 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Rhythm of your spend</h3>
                  <p className="text-xs text-slate-500">
                    Daily, monthly, and category dynamics in one glance.
                  </p>
                </div>
              </div>
              {/* @ts-expect-error Server -> Client */}
              <ExpenseCharts expenses={expenses.map((e) => ({
                  date: e.date,
                  amount: e.amount,
                  category: e.category
                }))}
              />
            </div>

            <div className="rounded-3xl bg-white/95 p-4 shadow-md ring-1 ring-slate-100 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Recent transactions</h3>
                  <p className="text-xs text-slate-500">
                    The latest 10 entries, with subtle hints for category & time.
                  </p>
                </div>
                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500">
                  {expenses.length ? `${expenses.length} total` : "No data yet"}
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {expenses.slice(0, 10).map((exp) => (
                  <li key={exp.id} className="flex items-start gap-3 py-2.5">
                    <div
                      className="mt-1 h-8 w-0.5 rounded-full"
                      style={{
                        background:
                          exp.amount > 0
                            ? "linear-gradient(to bottom, #fb7185, #f97316)"
                            : "linear-gradient(to bottom, #22c55e, #0ea5e9)"
                      }}
                    />
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {exp.merchant ?? exp.category}
                          </p>
                          <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
                            {exp.category}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {exp.paymentMethod ? exp.paymentMethod.toUpperCase() + " · " : ""}
                          {exp.date.toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })}
                        </p>
                      </div>
                      <div
                        className={
                          "text-sm font-semibold tabular-nums " +
                          (exp.amount > 0 ? "text-rose-500" : "text-emerald-600")
                        }
                      >
                        {baseCurrency} {exp.amount.toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
                {expenses.length === 0 && (
                  <li className="py-6 text-center text-sm text-slate-500">
                    No expenses yet. Add your first one on the left to see the list come alive.
                  </li>
                )}
              </ul>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
