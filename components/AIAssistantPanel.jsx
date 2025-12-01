"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const exampleQuestions = [
  "How much did I spend on dining last month?",
  "Compare my last 3 months of total spending.",
  "Which category is growing the fastest?",
  "How much did I spend on subscriptions recently?"
];

export default function AIAssistantPanel() {
  const [activeTab, setActiveTab] = useState("nl"); 
  const [queryText, setQueryText] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlError, setNlError] = useState(null);
  const [nlResult, setNlResult] = useState(null);

  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState(null);
  const [recoResult, setRecoResult] = useState(null);

  async function handleAsk(e) {
    e?.preventDefault();
    if (!queryText.trim()) return;
    setNlLoading(true);
    setNlError(null);
    setNlResult(null);

    try {
      const res = await fetch("/api/nl-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: queryText.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        setNlError(data?.error || "Something went wrong.");
      } else {
        setNlResult(data);
      }
    } catch (err) {
      console.error(err);
      setNlError("Network error. Please try again.");
    } finally {
      setNlLoading(false);
    }
  }

  async function handleRecommendations() {
    setRecoLoading(true);
    setRecoError(null);
    setRecoResult(null);

    try {
      const res = await fetch("/api/recommandations", {
        method: "POST"
      });

      const data = await res.json();
      if (!res.ok) {
        setRecoError(data?.error || "Something went wrong.");
      } else {
        setRecoResult(data);
      }
    } catch (err) {
      console.error(err);
      setRecoError("Network error. Please try again.");
    } finally {
      setRecoLoading(false);
    }
  }

  const isNl = activeTab === "nl";

  return (
    <motion.section
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.14)] sm:p-5"
    >
      <div className="pointer-events-none absolute -right-16 -top-10 h-24 w-24 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-[-10px] h-24 w-24 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-slate-100 ring-1 ring-slate-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AI spending assistant</span>
          </div>
          <h2 className="mt-2 text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
            Ask, explore, and get tailored money insights
          </h2>
          <p className="text-[11px] text-slate-500">
            Natural language answers + smart recommendations, powered only by your own expense data.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab("nl")}
            className={
              "relative rounded-full px-3 py-1.5 transition " +
              (isNl
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            Ask a question
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reco")}
            className={
              "relative rounded-full px-3 py-1.5 transition " +
              (!isNl
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            Smart summary
          </button>
        </div>
      </div>

      <div className="relative mt-4">
        <AnimatePresence mode="wait">
          {isNl ? (
            <motion.div
              key="nl-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-4"
            >
              <form onSubmit={handleAsk} className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Ask about your spending
                  </label>
                  <textarea
                    rows={3}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="e.g. “How much did I spend on groceries last month?”"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                    <div className="flex flex-wrap gap-1.5">
                      {exampleQuestions.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQueryText(q)}
                          className="rounded-full bg-white px-2.5 py-1 text-[10px] text-slate-500 ring-1 ring-slate-200 transition hover:text-sky-700 hover:ring-sky-300"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                    <span>AI only uses your last 6 months of data.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="submit"
                    disabled={nlLoading || !queryText.trim()}
                    className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {nlLoading ? "Thinking…" : "Ask AI about this"}
                  </button>
                  {nlError && (
                    <span className="text-[11px] text-rose-500">
                      {nlError}
                    </span>
                  )}
                </div>
              </form>

              <div className="rounded-2xl bg-slate-50/80 p-3 ring-1 ring-slate-100">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-[13px] text-slate-50 shadow-sm">
                    💬
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-900">
                      AI answer
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Always grounded in your own expense data.
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-100">
                  {nlLoading && (
                    <span className="text-[11px] text-slate-500">
                      Analysing your records…
                    </span>
                  )}
                  {!nlLoading && nlResult?.answer && (
                    <p className="whitespace-pre-line text-sm text-slate-800">
                      {nlResult.answer}
                    </p>
                  )}
                  {!nlLoading && !nlResult?.answer && !nlError && (
                    <p className="text-[11px] text-slate-500">
                      Ask a question above to see a tailored explanation here.
                    </p>
                  )}
                </div>

                {nlResult?.usedDataSummary && (
                  <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] text-slate-600 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-100">
                      <p className="text-[10px] font-medium text-slate-500">
                        Months in context
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {Object.keys(nlResult.usedDataSummary.monthlyTotals || {}).length ||
                          Object.keys(nlResult.usedDataSummary.monthlyTotals || {}).length === 0
                          ? Object.keys(nlResult.usedDataSummary.monthlyTotals || {}).length
                          : "—"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-100">
                      <p className="text-[10px] font-medium text-slate-500">
                        Top categories used
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {Array.isArray(nlResult.usedDataSummary.topCategories)
                          ? nlResult.usedDataSummary.topCategories.length
                          : "—"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-100">
                      <p className="text-[10px] font-medium text-slate-500">
                        Transactions sampled
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {Array.isArray(nlResult.usedDataSummary.recentTransactions)
                          ? nlResult.usedDataSummary.recentTransactions.length
                          : "—"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reco-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-900">
                    Generate smart monthly summary
                  </p>
                  <p className="text-[11px] text-slate-500">
                    AI will scan your recent expenses to highlight patterns, top categories, and possible savings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRecommendations}
                  disabled={recoLoading}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow-sm transition hover:bg-emerald-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {recoLoading ? "Analysing…" : "Generate insights"}
                </button>
              </div>

              {recoError && (
                <div className="rounded-2xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700 ring-1 ring-rose-100">
                  {recoError}
                </div>
              )}

              {!recoResult && !recoLoading && (
                <div className="rounded-2xl bg-slate-50/80 px-3 py-3 text-[11px] text-slate-500 ring-1 ring-slate-100">
                  You haven&apos;t generated insights for this session yet. Click{" "}
                  <span className="font-medium text-slate-700">Generate insights</span> to see a
                  summary tailored to your data.
                </div>
              )}

              {recoResult && (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-50 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                      Monthly summary
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">
                      {recoResult.summary || "No summary available."}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Top categories
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(recoResult.top_categories) &&
                      recoResult.top_categories.length > 0 ? (
                        recoResult.top_categories.map((c, idx) => (
                          <div
                            key={c.category + idx}
                            className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-100"
                          >
                            <span className="h-5 w-5 rounded-full bg-slate-900 text-center text-[11px] text-slate-50">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-medium">{c.category}</p>
                              <p className="text-[11px] text-slate-500">
                                {c.amount != null && !Number.isNaN(Number(c.amount))
                                  ? `Approx. ${Number(c.amount).toFixed(0)} (${c.percent ?? "—"}%)`
                                  : `${c.percent ?? "—"}%`}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          Not enough data to compute top categories yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Budget recommendations
                    </p>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(recoResult.recommendations) &&
                      recoResult.recommendations.length > 0 ? (
                        recoResult.recommendations.map((r, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800 ring-1 ring-emerald-100"
                          >
                            <span className="mt-[2px] text-[13px]">•</span>
                            <div>
                              <p className="font-medium">{r.text}</p>
                              {r.estimated_savings && (
                                <p className="mt-0.5 text-[11px] text-emerald-700">
                                  Estimated savings: {r.estimated_savings}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          AI will suggest concrete savings steps once it sees more activity.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Likely subscriptions
                    </p>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(recoResult.subscriptions) &&
                      recoResult.subscriptions.length > 0 ? (
                        recoResult.subscriptions.map((s, idx) => (
                          <div
                            key={s.merchant + idx}
                            className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-100"
                          >
                            <div>
                              <p className="font-medium">{s.merchant}</p>
                              <p className="text-[11px] text-slate-500">Recurring (AI detected)</p>
                            </div>
                            <span className="rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-50">
                              {s.monthly_amount}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          No clear recurring subscriptions detected yet, or not enough data.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
