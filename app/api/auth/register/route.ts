import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email = body?.email as string | undefined;
    const password = body?.password as string | undefined;
    const name = (body?.name as string | undefined) ?? null;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if a user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.hashedPassword) {
      // Fully registered credentials user already exists
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (existingUser && !existingUser.hashedPassword) {
      // User was created via OAuth (e.g., Google); attach a password to that account
      user = await prisma.user.update({
        where: { email },
        data: {
          hashedPassword,
          name: name ?? existingUser.name
        }
      });
    } else {
      // Brand new user
      user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          name
        }
      });
    }

    const { hashedPassword: _, ...safeUser } = user as any;

    return NextResponse.json(
      { user: safeUser },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error in /api/auth/register:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
