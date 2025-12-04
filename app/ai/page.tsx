import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import Link from "next/link";
import AIAssistantPanel from "../../components/AIAssistantPanel";

export const dynamic = "force-dynamic";

export default async function AIPage() {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const email = session?.user?.email as string | undefined;
  // @ts-ignore
  const name = (session?.user?.name as string | undefined)?.trim?.() || "";

  if (!email) {
    return (
      <main className="min-h-screen px-4 pb-10 pt-16">
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-3xl border border-slate-200/80 bg-white/95 px-6 py-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.16)]">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-slate-50 shadow-sm ring-1 ring-slate-800/80">
            <span className="text-lg font-semibold">🤖</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Sign in to use your AI spending assistant
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This space uses your private expense data to generate tailored insights. Sign in to let
            the assistant analyse your history.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-slate-950 hover:shadow-md"
            >
              Go to sign in
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName = name || email;
  const greetingPrefix = name ? "Your AI insight studio," : "AI insights for";

  return (
    <main className="relative min-h-screen px-4 pb-12 pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-12%] h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[25%] h-64 w-64 rounded-full bg-emerald-400/16 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[20%] h-80 w-80 rounded-full bg-sky-600/10 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(15,23,42,0.0) 0, rgba(15,23,42,1) 55%)," +
            "linear-gradient(to bottom, #020617, #020617)"
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-900 to-sky-900 p-[1px] shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
          <div className="relative flex flex-col gap-6 rounded-[1.5rem] bg-slate-950/90 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-[-20px] h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-medium text-slate-100 ring-1 ring-slate-700">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400/90 text-[9px]">
                  ●
                </span>
                <span>AI spending assistant · Private to your account</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl lg:text-[1.9rem]">
                {greetingPrefix}&nbsp;
                <span className="bg-gradient-to-r from-sky-300 via-emerald-300 to-sky-300 bg-clip-text font-semibold text-transparent">
                  {displayName}
                </span>
              </h1>
              <p className="max-w-xl text-sm text-slate-300">
                Ask natural language questions, generate smart summaries, and spot subscriptions —
                all grounded in your own expense history. No internet scraping, no external data.
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-300">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-1 ring-1 ring-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Last 6 months of spend only
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2.5 py-1 ring-1 ring-slate-700">
                  Read-only · No changes made to your data
                </span>
              </div>
            </div>

            <div className="relative mt-2 w-full max-w-sm rounded-2xl bg-slate-900/80 p-4 text-[11px] text-slate-200 ring-1 ring-slate-700/70 sm:mt-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                What this space is great for
              </p>
              <ul className="mt-2 space-y-1.5 text-[11px] text-slate-300">
                <li>• Quick “why is this month higher?” questions</li>
                <li>• Understanding which categories dominate your spend</li>
                <li>• Spotting subscriptions you might have forgotten</li>
                <li>• Getting concrete monthly saving suggestions</li>
              </ul>
              <p className="mt-3 text-[10px] text-slate-500">
                Tip: keep this tab open while you experiment with different questions.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <div className="space-y-4">
            <AIAssistantPanel />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 text-[11px] text-slate-200 shadow-[0_16px_50px_rgba(15,23,42,0.8)]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                HOW THIS AI THINKS
              </h2>
              <div className="mt-3 space-y-2">
                <p>
                  • Looks at up to <span className="font-semibold text-slate-50">6 months</span> of
                  your expense history.
                </p>
                <p>
                  • Computes totals per month, per category, and scans your{" "}
                  <span className="font-semibold text-slate-50">recent 50+ transactions</span>.
                </p>
                <p>
                  • Uses that context only to generate an answer —{" "}
                  <span className="font-semibold text-emerald-300">no external browsing</span>.
                </p>
                <p>
                  • For summaries, it also tries to detect{" "}
                  <span className="font-semibold text-slate-50">likely recurring subscriptions</span>{" "}
                  and suggests concrete savings.
                </p>
              </div>
              <p className="mt-3 text-[10px] text-slate-500">
                Think of it as a private analyst sitting on top of your own numbers, not an all-knowing chatbot.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-4 text-[11px] text-slate-700 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                IDEAS TO TRY
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-500">Questions</p>
                  <ul className="space-y-1.5">
                    <li>• “Why is this month more expensive than last month?”</li>
                    <li>• “Which 2 categories should I reduce first?”</li>
                    <li>• “Summarise my last 90 days of spending.”</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-500">
                    Savings & subscriptions
                  </p>
                  <ul className="space-y-1.5">
                    <li>• “Show subscriptions I could cancel or downgrade.”</li>
                    <li>• “If I cut 15% in food delivery, what happens?”</li>
                    <li>• “Suggest a realistic monthly budget from my history.”</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-slate-100/90 p-4 text-[11px] text-slate-700 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                PRIVACY & LIMITS
              </h2>
              <ul className="mt-2 space-y-1.5">
                <li>• The assistant never edits or deletes your expenses.</li>
                <li>• It can’t move money or connect to your bank — this is read-only.</li>
                <li>
                  • Treat suggestions as guidance, not strict financial advice. You decide what to
                  change.
                </li>
              </ul>
              <p className="mt-3 text-[10px] text-slate-500">
                As this product grows, this page is the perfect home for more advanced AI tools:
                projections, “what if” scenarios, and multi-month planning.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
