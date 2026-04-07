import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Variant = {
  size?: string;
  retailPrice?: string;
  retailDiscountPrice?: string;
  boxQty?: number;
  boxPrice?: string;
  boxDiscountPrice?: string;
  image?: string;
  unitPrice?: string;
  discountPrice?: string;
  unitStock?: number;
  boxStock?: number;
  vatClass?: string;
};

type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: Variant[];
};

type IncomingRow = {
  slug: string;
  originalSize: string;
  size: string;
  boxQty: string | number;
  retailPrice: string;
  unitDiscountPercent: string | number;
  boxPrice: string;
  boxDiscountPercent: string | number;
  unitStock: string | number;
  boxStock: string | number;
  vatClass: string;
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");

function ensureProductsFile() {
  if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, "[]", "utf-8");
  }
}

function readProducts(): Product[] {
  ensureProductsFile();
  const content = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(content || "[]");
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
}

function normalizeSize(value: string | number | undefined) {
  return String(value || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rows: IncomingRow[] = Array.isArray(body.rows) ? body.rows : [];

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { success: false, message: "Rows data is invalid." },
        { status: 400 }
      );
    }

    const products = readProducts();

    for (const row of rows) {
      const product = products.find((p) => p.slug === row.slug);
      if (!product) continue;

      const variant = product.variants.find(
        (v) => normalizeSize(v.size) === normalizeSize(row.originalSize)
      );

      if (!variant) continue;

      const retailPriceNum = Number(row.retailPrice || 0);
      const unitDiscountPercentNum = Number(row.unitDiscountPercent || 0);
      const boxPriceNum = Number(row.boxPrice || 0);
      const boxDiscountPercentNum = Number(row.boxDiscountPercent || 0);

      let retailDiscountPrice = "";
      if (retailPriceNum > 0 && unitDiscountPercentNum > 0) {
        retailDiscountPrice = (
          retailPriceNum *
          (1 - unitDiscountPercentNum / 100)
        ).toFixed(2);
      }

      let boxDiscountPrice = "";
      if (boxPriceNum > 0 && boxDiscountPercentNum > 0) {
        boxDiscountPrice = (
          boxPriceNum *
          (1 - boxDiscountPercentNum / 100)
        ).toFixed(2);
      }

      variant.size = String(row.size || "").trim();
      variant.boxQty = Number(row.boxQty || 0);
      variant.retailPrice = retailPriceNum > 0 ? retailPriceNum.toFixed(2) : "";
      variant.retailDiscountPrice = retailDiscountPrice;
      variant.boxPrice = boxPriceNum > 0 ? boxPriceNum.toFixed(2) : "";
      variant.boxDiscountPrice = boxDiscountPrice;

      variant.unitStock = Number(row.unitStock || 0);
      variant.boxStock = Number(row.boxStock || 0);
      variant.vatClass = String(row.vatClass || "zero").trim() || "zero";
    }

    writeProducts(products);

    return NextResponse.json({
      success: true,
      message: "Bulk price and stock update completed successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Bulk update failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}