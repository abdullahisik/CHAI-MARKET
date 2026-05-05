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
    const brand = String(body.brand || "").trim() || null;
    const sku = String(body.sku || "").trim() || null;
    const barcode = String(body.barcode || "").trim() || null;
    const weight = String(body.weight || "").trim() || null;
    const packSize = String(body.packSize || "").trim() || null;
    const description = String(body.description || "").trim() || null;
    const imageUrl = String(body.imageUrl || "").trim() || null;
    const categoryId = String(body.categoryId || "").trim() || null;

    const salePrice =
      body.salePrice === "" || body.salePrice === null || body.salePrice === undefined
        ? null
        : Number(body.salePrice);

    const costPrice =
      body.costPrice === "" || body.costPrice === null || body.costPrice === undefined
        ? null
        : Number(body.costPrice);

    const comparePrice =
      body.comparePrice === "" || body.comparePrice === null || body.comparePrice === undefined
        ? null
        : Number(body.comparePrice);

    const stockQuantity =
      body.stockQuantity === "" || body.stockQuantity === null || body.stockQuantity === undefined
        ? 0
        : Number(body.stockQuantity);

    const lowStockThreshold =
      body.lowStockThreshold === "" ||
      body.lowStockThreshold === null ||
      body.lowStockThreshold === undefined
        ? 5
        : Number(body.lowStockThreshold);

    const isActive = Boolean(body.isActive);
    const isFeatured = Boolean(body.isFeatured);

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (
      (salePrice !== null && Number.isNaN(salePrice)) ||
      (costPrice !== null && Number.isNaN(costPrice)) ||
      (comparePrice !== null && Number.isNaN(comparePrice)) ||
      Number.isNaN(stockQuantity) ||
      Number.isNaN(lowStockThreshold)
    ) {
      return NextResponse.json(
        { error: "Please enter valid numeric values." },
        { status: 400 }
      );
    }

    let validCategoryId: string | null = null;

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          storeId: adminUser.storeId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Selected category is invalid." },
          { status: 400 }
        );
      }

      validCategoryId = category.id;
    }

    const baseSlug = slugify(name);
    let finalSlug = baseSlug || `product-${Date.now()}`;

    const existing = await prisma.product.findFirst({
      where: {
        storeId: adminUser.storeId,
        slug: finalSlug,
      },
    });

    if (existing) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        storeId: adminUser.storeId,
        name,
        slug: finalSlug,
        brand,
        sku,
        barcode,
        weight,
        packSize,
        description,
        imageUrl,
        categoryId: validCategoryId,
        salePrice,
        costPrice,
        comparePrice,
        stockQuantity,
        lowStockThreshold,
        isActive,
        isFeatured,
      },
    });

    return NextResponse.json({
      success: true,
      productId: product.id,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the product." },
      { status: 500 }
    );
  }
}