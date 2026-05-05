import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminCookieName } from "@/lib/admin-session";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: Request) {
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
      include: { store: true },
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    if (!slug) slug = `category-${Date.now()}`;

    const existing = await prisma.category.findFirst({
      where: {
        storeId: adminUser.storeId,
        slug,
      },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await prisma.category.create({
      data: {
        storeId: adminUser.storeId,
        name,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      categoryId: category.id,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the category." },
      { status: 500 }
    );
  }
}