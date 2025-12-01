
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
// @ts-ignore
    const user = await prisma.user.findUnique({ where: { email: session?.user?.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 500
    });

    const serialized = expenses.map((e:any) => ({
      date: e.date.toISOString(),
      amount: e.amount,
      category: e.category,
      merchant: e.merchant,
      notes: e.notes,
      tags: e.tags,
      recurring: e.recurring
    }));

    const prompt = `
System: You are an expert personal finance assistant for a mobile/web expense app.
User: Given the following user expense summary and transactions, produce:
1) A one-sentence monthly summary.
2) Top 3 spending categories with percentages.
3) 3 actionable budget recommendations tailored to the user (concrete amounts to reduce monthly spend and why).
4) Detect likely recurring subscriptions and list them.
Return JSON with keys: summary, top_categories [{category, amount, percent}], recommendations [{text, estimated_savings}], subscriptions [{merchant, monthly_amount}].
Expenses JSON: ${JSON.stringify(serialized)}
    `;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
      max_output_tokens: 800
    });

    // @ts-ignore
    const outputText = response.output?.[0]?.content?.[0]?.text ?? JSON.stringify(response);
 
    let parsed = null;
    try {
      parsed = JSON.parse(outputText);
    } catch (e) {
      return NextResponse.json({ raw: outputText }, { status: 200 });
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
