"use client";

import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { motion } from "framer-motion";

type PieSeries = {
  labels: string[];
  values: number[];
};

interface AnalyticsPieChartsProps {
  categorySeries: PieSeries;
  monthlySeries: PieSeries;
  paymentMethodSeries: PieSeries;
}

const palette = [
  "#0ea5e9", 
  "#6366f1", 
  "#22c55e", 
  "#f97316", 
  "#e11d48", 
  "#a855f7", 
  "#14b8a6", 
  "#64748b" 
];

function makePieData(series: PieSeries) {
  return {
    labels: series.labels,
    datasets: [
      {
        data: series.values,
        backgroundColor: series.labels.map((_, i) => palette[i % palette.length]),
        borderWidth: 1,
        borderColor: "#0f172a",
        hoverOffset: 6
      }
    ]
  };
}

function buildMeta(series: PieSeries) {
  const total = series.values.reduce((sum, v) => sum + v, 0);
  if (!series.labels.length || total <= 0) {
    return { total: 0, topLabel: null, topValue: 0, topPercent: 0 };
  }
  let maxIdx = 0;
  for (let i = 1; i < series.values.length; i++) {
    if (series.values[i] > series.values[maxIdx]) maxIdx = i;
  }
  const topValue = series.values[maxIdx];
  const topLabel = series.labels[maxIdx];
  const topPercent = total ? (topValue / total) * 100 : 0;
  return { total, topLabel, topValue, topPercent };
}

const pieOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "rgba(15,23,42,0.96)",
      borderColor: "rgba(148,163,184,0.6)",
      borderWidth: 1,
      cornerRadius: 10,
      padding: 10,
      titleFont: { size: 12, weight: "600" },
      bodyFont: { size: 11 },
      callbacks: {
        label: (ctx: any) => {
          const label = ctx.label ?? "";
          const value = ctx.raw ?? 0;
          const dataset = ctx.dataset?.data ?? [];
          const total = dataset.reduce((sum: number, v: number) => sum + v, 0);
          const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
          return `${label}: ${value} (${pct}%)`;
        }
      }
    }
  },
  layout: {
    padding: 8
  }
};

type PieCardProps = {
  title: string;
  subtitle: string;
  series: PieSeries;
  accent: "sky" | "emerald" | "slate";
};

function PieCard({ title, subtitle, series, accent }: PieCardProps) {
  const meta = buildMeta(series);
  const data = makePieData(series);

  const accentRing =
    accent === "sky"
      ? "ring-sky-400/60"
      : accent === "emerald"
      ? "ring-emerald-400/60"
      : "ring-slate-400/60";

  const accentPillBg =
    accent === "sky"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : accent === "emerald"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  const accentDot =
    accent === "sky"
      ? "bg-sky-500"
      : accent === "emerald"
      ? "bg-emerald-500"
      : "bg-slate-500";

  return (
    <motion.div
      className="relative flex flex-col overflow-hidden rounded-3xl bg-white/95 p-4 shadow-md ring-1 ring-slate-200"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`inline-flex max-w-[160px] items-center gap-1 rounded-full border px-2 py-1 text-[10px] ${accentPillBg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${accentDot}`} />
          {meta.topLabel ? (
            <span className="truncate">
              Top: <span className="font-semibold">{meta.topLabel}</span> ·{" "}
              {meta.topPercent.toFixed(1)}%
            </span>
          ) : (
            <span>No data yet</span>
          )}
        </div>
      </div>

      <div
        className={`relative flex flex-1 flex-col items-center justify-between gap-3 rounded-2xl bg-slate-50/60 p-3 ring-1 ${accentRing}`}
      >
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          {series.labels.length === 0 ? (
            <div className="flex h-[220px] w-full items-center justify-center text-xs text-slate-500">
              No data to show. Add a few expenses and come back here to see this bloom.
            </div>
          ) : (
            <div className="h-[200px] w-full">
              <Pie data={data} options={pieOptions} />
            </div>
          )}
        </div>

        {series.labels.length > 0 && (
          <div className="mt-2 flex w-full flex-wrap gap-1.5">
            {series.labels.slice(0, 6).map((label, idx) => {
              const value = series.values[idx] ?? 0;
              const pct =
                meta.total > 0 ? ((value / meta.total) * 100).toFixed(1) : "0.0";
              return (
                <div
                  key={label + idx}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] text-slate-600 shadow-sm ring-1 ring-slate-100"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: palette[idx % palette.length] }}
                  />
                  <span className="max-w-[90px] truncate">{label}</span>
                  <span className="text-[9px] text-slate-400">· {pct}%</span>
                </div>
              );
            })}
            {series.labels.length > 6 && (
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-1 text-[10px] text-slate-50 shadow-sm">
                +{series.labels.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AnalyticsPieCharts({
  categorySeries,
  monthlySeries,
  paymentMethodSeries
}: AnalyticsPieChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <PieCard
        title="Category-wise spending"
        subtitle="See which themes dominate your wallet over time."
        series={categorySeries}
        accent="sky"
      />
      <PieCard
        title="Monthly distribution"
        subtitle="Each slice shows how months share your total spend."
        series={monthlySeries}
        accent="emerald"
      />
      <PieCard
        title="Payment method mix"
        subtitle="UPI vs card vs cash — how you choose to pay."
        series={paymentMethodSeries}
        accent="slate"
      />
    </div>
  );
}
