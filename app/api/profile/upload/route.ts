import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { imageUrl } = await req.json();
  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { image: imageUrl }
  });

  return NextResponse.json({ success: true, user });
}
