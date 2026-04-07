import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type ProductVariant = {
  size: string;
  retailPrice: string;
  retailDiscountPrice?: string;
  boxQty: number;
  boxPrice: string;
  boxDiscountPrice?: string;
  image: string;
};

type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: ProductVariant[];
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");
const nutsPath = path.join(process.cwd(), "public", "products", "NUTS");

function readProducts(): Product[] {
  if (!fs.existsSync(productsFilePath)) {
    fs.writeFileSync(productsFilePath, "[]", "utf-8");
  }
  const content = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(content || "[]");
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
}

function makeSlug(value: string) {
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

function titleCaseLoose(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function normalizeBaseName(fileName: string) {
  return fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/\s+/g, " ").trim();
}

export async function POST() {
  try {
    if (!fs.existsSync(nutsPath)) {
      return NextResponse.json(
        { success: false, message: "NUTS folder not found." },
        { status: 404 }
      );
    }

    const products = readProducts();

    const folders = [
      { folder: "BIG NUTS", subCategory: "Big Nut" },
      { folder: "SMALL NUTS", subCategory: "Small Nut" },
    ];

    let addedProducts = 0;

    for (const item of folders) {
      const folderPath = path.join(nutsPath, item.folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = fs.readdirSync(folderPath, { withFileTypes: true });

      for (const file of files) {
        if (!file.isFile()) continue;
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) continue;

        const baseName = normalizeBaseName(file.name);
        const name = titleCaseLoose(baseName);
        const slug = makeSlug(name);

        const exists = products.find(
          (p) => makeSlug(p.slug) === slug || makeSlug(p.name) === slug
        );

        if (exists) continue;

        products.push({
          slug,
          name,
          category: "Kuruyemis",
          subCategory: item.subCategory,
          description: "",
          variants: [
            {
              size: "",
              retailPrice: "",
              retailDiscountPrice: "",
              boxQty: 0,
              boxPrice: "",
              boxDiscountPrice: "",
              image: `/products/NUTS/${item.folder}/${file.name}`,
            },
          ],
        });

        addedProducts += 1;
      }
    }

    writeProducts(products);

    return NextResponse.json({
      success: true,
      message: "Nuts imported successfully.",
      addedProducts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Nuts import failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}