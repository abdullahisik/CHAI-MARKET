import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminCookieName } from "@/lib/admin-session";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookiePairs = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookiePairs.find((c) =>
      c.startsWith(`${adminCookieName}=`)
    );

    const userId = sessionCookie?.split("=")[1];

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { storeId: adminUser.storeId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("LIST CATEGORIES ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong while loading categories." },
      { status: 500 }
    );
  }
}