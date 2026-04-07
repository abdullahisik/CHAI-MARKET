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

type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  size: string;
  purchaseType: "retail" | "box";
  quantity: number;
  unitPrice: number;
  boxQty: number;
  image: string;
  vatClass: "zero" | "standard";
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  items: CartItem[];
  subtotal: number;
  vatTotal: number;
  shipping: number;
  grandTotal: number;
  whatsappText: string;
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");
const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export async function GET() {
  const products = readJson<Product[]>(productsFilePath, []);
  const orders = readJson<Order[]>(ordersFilePath, []);

  const discountProducts = products.filter((product) =>
    (product.variants || []).some(
      (v) =>
        Number(v.retailDiscountPrice || 0) > 0 ||
        Number(v.boxDiscountPrice || 0) > 0 ||
        Number(v.discountPrice || 0) > 0
    )
  );

  const salesMap = new Map<string, number>();

  for (const order of orders) {
    for (const item of order.items || []) {
      const current = salesMap.get(item.productSlug) || 0;
      const units =
        item.purchaseType === "box"
          ? item.quantity * Number(item.boxQty || 0)
          : item.quantity;
      salesMap.set(item.productSlug, current + units);
    }
  }

  const bestSellers = [...products]
    .sort((a, b) => (salesMap.get(b.slug) || 0) - (salesMap.get(a.slug) || 0))
    .slice(0, 12);

  const newProducts = [...products].slice(0, 12);

  return NextResponse.json({
    discountProducts: discountProducts.slice(0, 12),
    bestSellers,
    newProducts,
  });
}