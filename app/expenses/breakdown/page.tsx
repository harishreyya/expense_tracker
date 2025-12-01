import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExpenseFilters, { ExpenseFilterValues } from "@/components/ExpenseFilters";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

interface ExpenseRow {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  category: string;
  merchant: string | null;
  paymentMethod: string | null;
}

interface GroupRow {
  key: string;
  label: string;
  total: number;
  count: number;
}

function getParam(sp: SearchParams, key: string): string | undefined {
  const value = sp[key];
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}

function formatCurrency(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

function groupByDay(expenses: ExpenseRow[]): GroupRow[] {
  const map = new Map<string, GroupRow>();

  for (const e of expenses) {
    const key = e.date.toISOString().slice(0, 10); 
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        key,
        label: e.date.toLocaleDateString("en-IN", { dateStyle: "medium" }),
        total: e.amount,
        count: 1
      });
    } else {
      existing.total += e.amount;
      existing.count += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1)); 
}

function groupByMonth(expenses: ExpenseRow[]): GroupRow[] {
  const map = new Map<string, GroupRow>();

  for (const e of expenses) {
    const monthKey = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
    const label = e.date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short"
    });
    const existing = map.get(monthKey);
    if (!existing) {
      map.set(monthKey, {
        key: monthKey,
        label,
        total: e.amount,
        count: 1
      });
    } else {
      existing.total += e.amount;
      existing.count += 1;
    }
  }

  return Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1));
}

export default async function ExpensesBreakdownPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
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
            to view your expense breakdown.
          </p>
        </div>
      </main>
    );
  }

  const sp = searchParams ?? {};
  const filterValues: ExpenseFilterValues = {
    from: getParam(sp, "from"),
    to: getParam(sp, "to"),
    category: getParam(sp, "category"),
    paymentMethod: getParam(sp, "paymentMethod"),
    minAmount: getParam(sp, "minAmount"),
    maxAmount: getParam(sp, "maxAmount")
  };

  // @ts-ignore
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });

  const where: any = {
    userId: user?.id
  };

  if (filterValues.from || filterValues.to) {
    where.date = {};
    if (filterValues.from) {
      const fromDate = new Date(filterValues.from);
      if (!Number.isNaN(fromDate.getTime())) {
        where.date.gte = fromDate;
      }
    }
    if (filterValues.to) {
      const toDate = new Date(filterValues.to);
      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        where.date.lte = toDate;
      }
    }
  }

  if (filterValues?.category) {
    where.category = { contains: filterValues?.category, mode: "insensitive" };
  }

  if (filterValues?.paymentMethod) {
    where.paymentMethod = filterValues?.paymentMethod;
  }

  if (filterValues?.minAmount || filterValues?.maxAmount) {
    where.amount = {};
    const min = filterValues.minAmount ? Number(filterValues.minAmount) : undefined;
    const max = filterValues.maxAmount ? Number(filterValues.maxAmount) : undefined;
    if (typeof min === "number" && !Number.isNaN(min)) where.amount.gte = min;
    if (typeof max === "number" && !Number.isNaN(max)) where.amount.lte = max;
  }

  const rawExpenses = user
    ? await prisma.expense.findMany({
        where,
        orderBy: { date: "desc" }
      })
    : [];

  const expenses: ExpenseRow[] = rawExpenses.map((e: any) => ({
    id: e.id,
    date: e.date,
    amount: e.amount,
    currency: e.currency,
    category: e.category,
    merchant: e.merchant,
    paymentMethod: e.paymentMethod
  }));

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCount = expenses.length;
  const dailyGroups = groupByDay(expenses);
  const monthlyGroups = groupByMonth(expenses);
  const baseCurrency = expenses[0]?.currency ?? "INR";

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="pointer-events-none absolute inset-x-0 top-14 flex justify-center">
          <div className="h-24 w-[70%] max-w-4xl rounded-full bg-gradient-to-r from-sky-500/15 via-emerald-400/12 to-sky-500/15 blur-3xl" />
        </div>
        <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.12)] sm:p-5 md:p-6">
          <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-sky-100 ring-1 ring-slate-800/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Deep breakdown · Filters + groups</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Expenses breakdown
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                See your spending as a structured story: by day, by month, and across every single
                transaction. Use filters to zoom in on exactly what matters.
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
                href="/analytics"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-950"
              >
                Analytics (charts)
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200/70 bg-white/95 p-3 shadow-sm sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filters
              </p>
              <p className="text-[11px] text-slate-500">
                Combine date, category, payment method, and amount to slice your data.
              </p>
            </div>
            <div className="hidden text-[11px] text-slate-400 sm:inline-flex">
              Tip: Save a bookmark with query params as your “view” preset.
            </div>
          </div>
          <ExpenseFilters initialValues={filterValues} />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 p-4 text-slate-50 shadow-md ring-1 ring-slate-800/70">
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sky-500/40 blur-xl" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
              Total spent
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalAmount > 0 ? formatCurrency(totalAmount, baseCurrency) : "—"}
            </p>
            <p className="mt-1 text-[11px] text-slate-300">
              Across all matching records for the filters you&apos;ve chosen.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Transactions
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{totalCount}</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Every row is a story — filters simply decide which ones to show.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Avg. per transaction
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {totalCount > 0 ? formatCurrency(totalAmount / totalCount, baseCurrency) : "—"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              A quick feel of how heavy each spend typically is under the current lens.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">By day</h2>
              <p className="text-[11px] text-slate-500">
                Each row represents a calendar day with its total and transaction count.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500">
              {dailyGroups.length} days in view
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 shadow-md ring-1 ring-slate-200">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500" />
            <div className="max-h-[360px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50/95 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Transactions</th>
                    <th className="px-4 py-3 text-right font-medium">Total amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyGroups.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        No expenses for selected filters. Try widening your range or removing a
                        filter.
                      </td>
                    </tr>
                  )}
                  {dailyGroups.map((group) => (
                    <tr
                      key={group.key}
                      className="border-t border-slate-100/80 bg-white hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3 text-sm text-slate-900">{group.label}</td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">{group.count}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {formatCurrency(group.total, baseCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">By month</h2>
              <p className="text-[11px] text-slate-500">
                Month-level aggregates to spot heavier or lighter spending periods.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500">
              {monthlyGroups.length} months in view
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 shadow-md ring-1 ring-slate-200">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-400 via-sky-500 to-emerald-400" />
            <div className="max-h-[320px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50/95 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Month</th>
                    <th className="px-4 py-3 text-right font-medium">Transactions</th>
                    <th className="px-4 py-3 text-right font-medium">Total amount</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyGroups.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        No expenses for selected filters.
                      </td>
                    </tr>
                  )}
                  {monthlyGroups.map((group) => (
                    <tr
                      key={group.key}
                      className="border-t border-slate-100/80 bg-white hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3 text-sm text-slate-900">{group.label}</td>
                      <td className="px-4 py-3 text-right text-sm text-slate-700">{group.count}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {formatCurrency(group.total, baseCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-3 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">All matching records</h2>
              <p className="text-[11px] text-slate-500">
                The uncompressed truth: every transaction that survives your filters.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500">
              {expenses.length} rows
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 shadow-md ring-1 ring-slate-200">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-slate-900 via-sky-500 to-slate-900" />
            <div className="max-h-[420px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50/95 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Merchant</th>
                    <th className="px-4 py-3 text-left font-medium">Payment</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-slate-500"
                      >
                        No expenses found. Adjust your filters or add some transactions.
                      </td>
                    </tr>
                  )}
                  {expenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="border-t border-slate-100/80 bg-white hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {exp.date.toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">{exp.category}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{exp.merchant ?? "—"}</td>
                      <td className="px-4 py-3 text-sm capitalize text-slate-600">
                        {exp.paymentMethod ? exp.paymentMethod.toLowerCase() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {formatCurrency(exp.amount, exp.currency ?? baseCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
