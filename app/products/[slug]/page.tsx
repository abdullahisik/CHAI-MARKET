import fs from "fs";
import path from "path";
import ProductDetailClient from "../../components/product-detail-client";

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
  slug?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  variants?: Variant[];
};

const filePath = path.join(process.cwd(), "data", "products.json");

function readProducts(): Product[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent || "[]");
  } catch {
    return [];
  }
}

function normalize(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[()'.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const products = readProducts();

  const product = products.find(
    (p) => normalize(String(p.slug || p.name || "")) === normalize(slug)
  );

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  return <ProductDetailClient product={product} />;
}