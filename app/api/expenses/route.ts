
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    // @ts-ignore
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const url = new URL(req.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const category = url.searchParams.get("category");
    const paymentMethod = url.searchParams.get("paymentMethod");
    const minAmount = parseNumber(url.searchParams.get("minAmount"));
    const maxAmount = parseNumber(url.searchParams.get("maxAmount"));

    const where: any = {
      userId: user.id
    };

    if (from || to) {
      where.date = {};
      if (from) {
        const fromDate = new Date(from);
        if (!Number.isNaN(fromDate.getTime())) {
          where.date.gte = fromDate;
        }
      }
      if (to) {
        const toDate = new Date(to);
        if (!Number.isNaN(toDate.getTime())) {
          // end of day
          toDate.setHours(23, 59, 59, 999);
          where.date.lte = toDate;
        }
      }
    }

    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (typeof minAmount === "number" || typeof maxAmount === "number") {
      where.amount = {};
      if (typeof minAmount === "number") where.amount.gte = minAmount;
      if (typeof maxAmount === "number") where.amount.lte = maxAmount;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" }
    });

    return NextResponse.json({ data: expenses }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    // @ts-ignore
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const {
      date,
      amount,
      currency,
      category,
      merchant,
      notes,
      tags,
      paymentMethod,
      recurring
    } = body;

    if (!date || !amount || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const created = await prisma.expense.create({
      data: {
        userId: user.id,
        date: parsedDate,
        amount: Number(amount),
        currency: currency || "INR",
        category,
        merchant: merchant || null,
        notes: notes || null,
        tags: Array.isArray(tags) ? tags : (tags ?? []),
        paymentMethod: paymentMethod || null,
        recurring: Boolean(recurring)
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
