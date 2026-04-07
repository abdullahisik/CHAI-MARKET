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
const publicProductsPath = path.join(process.cwd(), "public", "products");

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

function detectBoxQty(size: string) {
  const s = String(size || "").toLowerCase().trim();

  if (s === "500g" || s === "0.5kg" || s === "half kg") return 20;
  if (s === "1kg" || s === "1 kg") return 8;
  if (s === "2kg" || s === "2 kg") return 8;
  if (s === "4kg" || s === "4 kg") return 4;

  return 0;
}

function normalizeBaseName(fileName: string) {
  return fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/\s+/g, " ").trim();
}

function titleCaseLoose(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function detectCategoryAndSubCategory(topFolder: string, midFolder?: string) {
  const top = topFolder.toUpperCase();

  if (top === "PULSES") {
    return { category: "Bakliyat", subCategory: "Pulses" };
  }

  if (top === "RICES") {
    return { category: "Bakliyat", subCategory: "Rice" };
  }

  if (top === "SUPERFOODS-SEEDS") {
    return { category: "Bakliyat", subCategory: "Seeds & Superfoods" };
  }

  if (top === "FLOUR-OATS") {
    return { category: "Un", subCategory: "Flour-Oats" };
  }

  if (top === "JELLIES") {
    return { category: "Jellybon", subCategory: "Jellies" };
  }

  if (top === "NUTS") {
    if ((midFolder || "").toUpperCase() === "BIG NUTS") {
      return { category: "Kuruyemis", subCategory: "Big Nut" };
    }
    if ((midFolder || "").toUpperCase() === "SMALL NUTS") {
      return { category: "Kuruyemis", subCategory: "Small Nut" };
    }
    return { category: "Kuruyemis", subCategory: "Nuts" };
  }

  return { category: topFolder, subCategory: topFolder };
}

function extractSizeAndCleanName(fileName: string, topFolder: string, midFolder?: string) {
  const original = normalizeBaseName(fileName);
  const upper = original.toUpperCase();

  const patterns: Array<{ regex: RegExp; size: string }> = [
    { regex: /\bHALF KG\b/i, size: "500g" },
    { regex: /\b500G\b/i, size: "500g" },
    { regex: /\b0\.5KG\b/i, size: "500g" },

    { regex: /\b1KG\b/i, size: "1kg" },
    { regex: /\b900G\b/i, size: "900g" },
    { regex: /\b800G\b/i, size: "800g" },
    { regex: /\b750G\b/i, size: "750g" },
    { regex: /\b700G\b/i, size: "700g" },
    { regex: /\b600G\b/i, size: "600g" },

    { regex: /\b170G(R)?\b/i, size: "170g" },
    { regex: /\b180G(R)?\b/i, size: "180g" },
    { regex: /\b200G(R)?\b/i, size: "200g" },
    { regex: /\b110G(R)?\b/i, size: "110g" },
    { regex: /\b120G(R)?\b/i, size: "120g" },
    { regex: /\b80G(R)?\b/i, size: "80g" },
    { regex: /\b100G(R)?\b/i, size: "100g" },

    { regex: /\b1\.8KG\b/i, size: "1.8kg" },
    { regex: /\b1\.9KG\b/i, size: "1.9kg" },
    { regex: /\b2KG\b/i, size: "2kg" },

    { regex: /\b3\.7KG\b/i, size: "3.7kg" },
    { regex: /\b3\.8KG\b/i, size: "3.8kg" },
    { regex: /\b4KG\b/i, size: "4kg" },
  ];

  for (const p of patterns) {
    if (p.regex.test(upper)) {
      const cleaned = original.replace(p.regex, "").replace(/\s+/g, " ").trim();
      return { size: p.size, baseName: cleaned };
    }
  }

  // Nuts: klasör adı size değildir. Size boş gelsin ki admin'den manuel girilsin.
  if (topFolder.toUpperCase() === "NUTS") {
    return { size: "", baseName: original };
  }

  // Diğer kategorilerde klasör yapısından varsayım yap
  const folder = String(midFolder || "").toUpperCase().trim();

  if (folder === "HALF KG") return { size: "500g", baseName: original };
  if (folder === "1 KG") return { size: "1kg", baseName: original };
  if (folder === "2-4 KG") return { size: "", baseName: original };

  return { size: "", baseName: original };
}

function walkImportableFiles() {
  const result: Array<{
    topFolder: string;
    midFolder?: string;
    fileName: string;
    relativeWebPath: string;
  }> = [];

  if (!fs.existsSync(publicProductsPath)) return result;

  const topFolders = fs.readdirSync(publicProductsPath, { withFileTypes: true });

  for (const top of topFolders) {
    if (!top.isDirectory()) continue;

    const topPath = path.join(publicProductsPath, top.name);
    const topEntries = fs.readdirSync(topPath, { withFileTypes: true });

    for (const entry of topEntries) {
      const level2Path = path.join(topPath, entry.name);

      if (entry.isDirectory()) {
        const level2Entries = fs.readdirSync(level2Path, { withFileTypes: true });

        let hasFilesAtLevel2 = false;

        for (const level2 of level2Entries) {
          if (level2.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(level2.name)) {
            hasFilesAtLevel2 = true;
            result.push({
              topFolder: top.name,
              midFolder: entry.name,
              fileName: level2.name,
              relativeWebPath: `/products/${top.name}/${entry.name}/${level2.name}`,
            });
          }
        }

        if (!hasFilesAtLevel2) {
          for (const level3 of level2Entries) {
            if (!level3.isDirectory()) continue;

            const level3Path = path.join(level2Path, level3.name);
            const level3Files = fs.readdirSync(level3Path, { withFileTypes: true });

            for (const f of level3Files) {
              if (!f.isFile()) continue;
              if (!/\.(jpg|jpeg|png|webp)$/i.test(f.name)) continue;

              result.push({
                topFolder: top.name,
                midFolder: entry.name,
                fileName: f.name,
                relativeWebPath: `/products/${top.name}/${entry.name}/${level3.name}/${f.name}`,
              });
            }
          }
        }
      } else if (entry.isFile()) {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) continue;

        result.push({
          topFolder: top.name,
          fileName: entry.name,
          relativeWebPath: `/products/${top.name}/${entry.name}`,
        });
      }
    }
  }

  return result;
}

export async function POST() {
  try {
    const existingProducts = readProducts();
    const files = walkImportableFiles();

    let addedProducts = 0;
    let addedVariants = 0;

    for (const file of files) {
      const { category, subCategory } = detectCategoryAndSubCategory(
        file.topFolder,
        file.midFolder
      );

      const { size, baseName } = extractSizeAndCleanName(
        file.fileName,
        file.topFolder,
        file.midFolder
      );

      const name = titleCaseLoose(baseName);
      const slug = makeSlug(name);

      const variant: ProductVariant = {
        size,
        retailPrice: "",
        retailDiscountPrice: "",
        boxQty: detectBoxQty(size),
        boxPrice: "",
        boxDiscountPrice: "",
        image: file.relativeWebPath,
      };

      const productIndex = existingProducts.findIndex(
        (p) => makeSlug(p.slug) === slug || makeSlug(p.name) === slug
      );

      if (productIndex === -1) {
        existingProducts.push({
          slug,
          name,
          category,
          subCategory,
          description: "",
          variants: [variant],
        });
        addedProducts += 1;
        addedVariants += 1;
      } else {
        const variantKey = String(size || "").toLowerCase().trim();
        const variantExists = existingProducts[productIndex].variants.some(
          (v) => String(v.size || "").toLowerCase().trim() === variantKey
        );

        if (!variantExists) {
          existingProducts[productIndex].variants.push(variant);
          addedVariants += 1;
        }
      }
    }

    writeProducts(existingProducts);

    return NextResponse.json({
      success: true,
      message: "Bulk import completed.",
      addedProducts,
      addedVariants,
      totalProducts: existingProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Bulk import failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}