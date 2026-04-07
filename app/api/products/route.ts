import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

type ProductVariant = {
  size: string;
  retailPrice?: string;
  retailDiscountPrice?: string;
  boxQty?: number;
  boxPrice?: string;
  boxDiscountPrice?: string;
  image?: string;
  unitPrice?: string;
  discountPrice?: string;
};

type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: ProductVariant[];
};

function readProducts(): Product[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent || "[]");
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
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

export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { success: false, message: "Products could not be loaded." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      category,
      subCategory,
      description,
      size,
      retailPrice,
      retailDiscountPrice,
      boxQty,
      boxPrice,
      boxDiscountPrice,
      image,
    } = body;

    if (
      !name ||
      !category ||
      !subCategory ||
      !description ||
      !size ||
      !retailPrice ||
      !boxQty ||
      !boxPrice ||
      !image
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const slug = makeSlug(name);
    const products = readProducts();

    const existingProductIndex = products.findIndex(
      (p) => makeSlug(p.slug) === slug || makeSlug(p.name) === slug
    );

    const newVariant: ProductVariant = {
      size: String(size).trim(),
      retailPrice: String(retailPrice).trim(),
      retailDiscountPrice: String(retailDiscountPrice || "").trim(),
      boxQty: Number(boxQty),
      boxPrice: String(boxPrice).trim(),
      boxDiscountPrice: String(boxDiscountPrice || "").trim(),
      image: String(image).trim(),
    };

    if (existingProductIndex >= 0) {
      const existingVariantIndex = products[existingProductIndex].variants.findIndex(
        (v) => String(v.size).toLowerCase() === String(size).toLowerCase().trim()
      );

      if (existingVariantIndex >= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "This product variant already exists. Use Edit.",
          },
          { status: 400 }
        );
      }

      products[existingProductIndex].variants.push(newVariant);
    } else {
      const newProduct: Product = {
        slug,
        name: String(name).trim(),
        category: String(category).trim(),
        subCategory: String(subCategory).trim(),
        description: String(description).trim(),
        variants: [newVariant],
      };

      products.push(newProduct);
    }

    writeProducts(products);

    return NextResponse.json({
      success: true,
      message: "Product saved successfully.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Product could not be saved." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      originalSlug,
      originalSize,
      name,
      category,
      subCategory,
      description,
      size,
      retailPrice,
      retailDiscountPrice,
      boxQty,
      boxPrice,
      boxDiscountPrice,
      image,
    } = body;

    if (!originalSlug || !originalSize) {
      return NextResponse.json(
        { success: false, message: "Original product data missing." },
        { status: 400 }
      );
    }

    const products = readProducts();

    const productIndex = products.findIndex(
      (p) => makeSlug(p.slug) === makeSlug(originalSlug)
    );

    if (productIndex < 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const variantIndex = products[productIndex].variants.findIndex(
      (v) => String(v.size).toLowerCase() === String(originalSize).toLowerCase()
    );

    if (variantIndex < 0) {
      return NextResponse.json(
        { success: false, message: "Variant not found." },
        { status: 404 }
      );
    }

    products[productIndex].name = String(name).trim();
    products[productIndex].category = String(category).trim();
    products[productIndex].subCategory = String(subCategory).trim();
    products[productIndex].description = String(description).trim();

    const newSlug = makeSlug(name);
    products[productIndex].slug = newSlug;

    products[productIndex].variants[variantIndex] = {
      size: String(size).trim(),
      retailPrice: String(retailPrice || "").trim(),
      retailDiscountPrice: String(retailDiscountPrice || "").trim(),
      boxQty: Number(boxQty),
      boxPrice: String(boxPrice || "").trim(),
      boxDiscountPrice: String(boxDiscountPrice || "").trim(),
      image: String(image || "").trim(),
    };

    writeProducts(products);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Product could not be updated." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { slug, size } = body;

    if (!slug || !size) {
      return NextResponse.json(
        { success: false, message: "Slug and size are required." },
        { status: 400 }
      );
    }

    const products = readProducts();
    const productIndex = products.findIndex(
      (p) => makeSlug(p.slug) === makeSlug(slug)
    );

    if (productIndex < 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    products[productIndex].variants = products[productIndex].variants.filter(
      (v) => String(v.size).toLowerCase() !== String(size).toLowerCase()
    );

    if (products[productIndex].variants.length === 0) {
      products.splice(productIndex, 1);
    }

    writeProducts(products);

    return NextResponse.json({
      success: true,
      message: "Variant deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Delete failed." },
      { status: 500 }
    );
  }
}