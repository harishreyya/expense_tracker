
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    // @ts-ignore
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { queryText } = await req.json();
    if (!queryText) return NextResponse.json({ error: "Missing query text" }, { status: 400 });
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Build context: aggregate last 6 months totals & top categories
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const expenses = await prisma.expense.findMany({
      where: { userId: user.id, date: { gte: sixMonthsAgo } },
      orderBy: { date: "desc" }
    });

    // aggregate monthly totals and top categories
    const monthlyTotals: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e:any) => {
      const monthKey = `${e.date.getFullYear()}-${String(e.date.getMonth()+1).padStart(2,"0")}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + e.amount;
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const context = {
      monthlyTotals,
      topCategories: Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>({category:k, amount:v})),
      recentTransactions: expenses.slice(0,50).map((e:any) => ({date: e.date.toISOString(), amount: e.amount, category: e.category, merchant: e.merchant}))
    };

    const prompt = `
System: You are a helpful assistant. Use ONLY the supplied context below to answer the user's natural language query. Do not hallucinate or fetch outside data. Return JSON { answer: string, usedDataSummary: {...} }.

Context: ${JSON.stringify(context)}

User Query: ${queryText}
    `;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 400
    });
// @ts-ignore
    const out = response.output?.[0]?.content?.[0]?.text ?? JSON.stringify(response);
    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch (e) {
      parsed = { answer: out, usedDataSummary: context };
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
