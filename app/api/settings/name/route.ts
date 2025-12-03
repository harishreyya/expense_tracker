import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions as any);

  // @ts-ignore
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = body?.name;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  try {
    // @ts-ignore
    const updated = await prisma.user.update({
          // @ts-ignore
      where: { email: session?.user?.email },
      data: { name: name.trim() },
    });

    return NextResponse.json({ name: updated.name }, { status: 200 });
  } catch (err: any) {
    console.error("Error updating name:", err);
    return NextResponse.json(
      { error: "Failed to update name. Please try again." },
      { status: 500 }
    );
  }
}
