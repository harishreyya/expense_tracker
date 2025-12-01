"use client";

import React, { useMemo, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";

const baseGridColor = "rgba(148, 163, 184, 0.25)";
const baseTickColor = "#475569";

export default function ExpenseCharts({ expenses = [] }) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); 
  const [viewMode, setViewMode] = useState("amount");

  const parsed = useMemo(
    () =>
      expenses.map((e) => ({
        date: e.date instanceof Date ? e.date : new Date(e.date),
        amount: Number(e.amount),
        category: e.category || "Uncategorized"
      })),
    [expenses]
  );

  const daily = useMemo(() => {
    const [y, m] = selectedMonth.split("-");
    const year = Number(y);
    const monthIndex = Number(m);

    const days = {};
    parsed.forEach((e) => {
      if (e.date.getFullYear() === year && e.date.getMonth() + 1 === monthIndex) {
        const d = e.date.getDate();
        days[d] = (days[d] || 0) + e.amount;
      }
    });

    const maxDay = new Date(year, monthIndex, 0).getDate();
    const labels = Array.from({ length: maxDay }, (_, i) => String(i + 1));
    const data = labels.map((l) => days[Number(l)] || 0);
    return { labels, data };
  }, [parsed, selectedMonth]);

  const monthly = useMemo(() => {
    const months = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = 0;
    }

    parsed.forEach((e) => {
      const key = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}`;
      if (key in months) {
        months[key] += e.amount;
      }
    });

    const labels = Object.keys(months);
    const data = labels.map((k) => months[k]);
    return { labels, data };
  }, [parsed]);

  const category = useMemo(() => {
    const map = {};
    parsed.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    const labels = Object.keys(map);
    const data = labels.map((l) => map[l]);
    return { labels, data };
  }, [parsed]);

  const maxDaily =
    daily.data.length && viewMode === "normalized"
      ? Math.max(...daily.data.map((v) => Math.abs(v))) || 1
      : 1;
  const maxMonthly =
    monthly.data.length && viewMode === "normalized"
      ? Math.max(...monthly.data.map((v) => Math.abs(v))) || 1
      : 1;

  const dailyData = {
    labels: daily.labels,
    datasets: [
      {
        label: "Spent",
        data:
          viewMode === "normalized"
            ? daily.data.map((v) =>
                maxDaily ? Number(((v / maxDaily) * 100).toFixed(1)) : 0
              )
            : daily.data,
        backgroundColor: "rgba(14, 165, 233, 0.85)",
        borderRadius: 6,
        maxBarThickness: 18
      }
    ]
  };

  const monthlyData = {
    labels: monthly.labels,
    datasets: [
      {
        label: "Spent",
        data:
          viewMode === "normalized"
            ? monthly.data.map((v) =>
                maxMonthly ? Number(((v / maxMonthly) * 100).toFixed(1)) : 0
              )
            : monthly.data,
        borderColor: "rgba(56, 189, 248, 1)",
        pointRadius: 3.5,
        pointBackgroundColor: "rgba(56, 189, 248, 1)",
        tension: 0.35
      }
    ]
  };

  const categoryData = {
    labels: category.labels,
    datasets: [
      {
        data: category.data,
        backgroundColor: [
          "#0ea5e9",
          "#22c55e",
          "#6366f1",
          "#f97316",
          "#ec4899",
          "#a855f7",
          "#14b8a6",
          "#facc15"
        ],
        borderWidth: 1
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: baseTickColor,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.96)",
        titleFont: { size: 12, weight: "600" },
        bodyFont: { size: 11 },
        padding: 10,
        borderColor: "rgba(148, 163, 184, 0.5)",
        borderWidth: 1,
        cornerRadius: 10
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(148, 163, 184, 0.08)"
        },
        ticks: {
          color: baseTickColor,
          font: { size: 10 }
        }
      },
      y: {
        grid: {
          color: baseGridColor
        },
        ticks: {
          color: baseTickColor,
          font: { size: 10 }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: baseTickColor,
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Interactive view of your spend pattern</span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Month</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode("amount")}
              className={
                "rounded-full px-2.5 py-1 transition " +
                (viewMode === "amount"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              Absolute
            </button>
            <button
              type="button"
              onClick={() => setViewMode("normalized")}
              className={
                "rounded-full px-2.5 py-1 transition " +
                (viewMode === "normalized"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900")
              }
            >
              Normalized %
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/90 p-[1px] shadow-md"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="relative h-[260px] rounded-[1.35rem] bg-slate-900 px-4 py-3 sm:px-5 sm:py-4">
            <div className="pointer-events-none absolute -right-10 -top-8 h-32 w-32 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Daily spend
                </h4>
                <p className="text-xs text-slate-300">
                  {selectedMonth} · each bar is a day&apos;s total
                </p>
              </div>
            </div>
            <div className="h-[190px]">
              <Bar
                data={dailyData}
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    legend: { display: false }
                  },
                  scales: {
                    ...commonOptions.scales,
                    x: { ...commonOptions.scales.x, grid: { display: false } }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-100 sm:p-5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut", delay: 0.05 }}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Monthly · last 12 months
              </h4>
              <p className="text-xs text-slate-500">
                See if your overall monthly spending is trending up or stabilizing.
              </p>
            </div>
          </div>
          <div className="h-[210px]">
            <Line
              data={monthlyData}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  legend: { display: false }
                },
                elements: {
                  line: {
                    borderWidth: 2.5
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-100 sm:p-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut", delay: 0.08 }}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              By category
            </h4>
            <p className="text-xs text-slate-500">
              Which areas pull most of your wallet? Each slice scales with its impact.
            </p>
          </div>
        </div>
        <div className="h-[230px]">
          {category.labels.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Not enough data yet to plot categories. Add a few expenses to see this light up.
            </div>
          ) : (
            <Pie data={categoryData} options={pieOptions} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
