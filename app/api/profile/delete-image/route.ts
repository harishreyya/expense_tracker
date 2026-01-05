import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST() {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const email = session?.user?.email;

  if (!email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.image) return NextResponse.json({ success: true });

  try {
    const publicId = user.image.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.v2.uploader.destroy(`expense_tracker/profile_images/${publicId}`);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }

  await prisma.user.update({
    where: { email },
    data: { image: null }
  });

  return NextResponse.json({ success: true });
}
