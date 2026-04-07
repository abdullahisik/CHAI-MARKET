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

function add20Percent(value: number) {
  return (value * 1.2).toFixed(2);
}

function add10Percent(value: number) {
  return (value * 1.1).toFixed(2);
}

const bigNutProducts = [
  {
    name: "Aytac Peanut Salted With Skin",
    size: "500g",
    boxQty: 14,
    retailPrice: add20Percent(1.77),
    boxPrice: add10Percent(24.78),
    image: "/products/NUTS/BIG NUTS/PEANUT SALTED WITH SKIN.jpg",
  },
  {
    name: "Aytac Raw Peanut With Red Skin",
    size: "500g",
    boxQty: 14,
    retailPrice: add20Percent(1.77),
    boxPrice: add10Percent(24.78),
    image: "/products/NUTS/BIG NUTS/RAW PEANUT WITH RED SKIN.jpg",
  },
  {
    name: "Aytac Jumbo Salted Pumpkin Seeds",
    size: "500g",
    boxQty: 14,
    retailPrice: add20Percent(2.13),
    boxPrice: add10Percent(29.82),
    image: "/products/NUTS/BIG NUTS/JUMBO SALTED PUMPKIN SEEDS.jpg",
  },
  {
    name: "Aytac Super Melon Seeds",
    size: "500g",
    boxQty: 14,
    retailPrice: add20Percent(2.85),
    boxPrice: add10Percent(39.90),
    image: "/products/NUTS/BIG NUTS/SUPER MELON SEEDS.jpg",
  },
  {
    name: "Aytac Pumpkin Seed Kernels",
    size: "450g",
    boxQty: 18,
    retailPrice: add20Percent(2.85),
    boxPrice: add10Percent(51.30),
    image: "/products/NUTS/BIG NUTS/PUMPKIN SEED KERNELS.jpg",
  },
  {
    name: "Aytac Apricots",
    size: "450g",
    boxQty: 14,
    retailPrice: add20Percent(3.56),
    boxPrice: add10Percent(49.84),
    image: "/products/NUTS/BIG NUTS/APRICOT.jpg",
  },
  {
    name: "Aytac Sun Dried Apricots",
    size: "450g",
    boxQty: 14,
    retailPrice: add20Percent(3.56),
    boxPrice: add10Percent(49.84),
    image: "/products/NUTS/BIG NUTS/SUN DRIED APRICOTS.jpg",
  },
  {
    name: "Aytac Salted Almonds & Cashews",
    size: "450g",
    boxQty: 14,
    retailPrice: add20Percent(4.99),
    boxPrice: add10Percent(69.86),
    image: "/products/NUTS/BIG NUTS/SALTED ALMONDS & CASHEWS.jpg",
  },
  {
    name: "Aytac Green Raisins",
    size: "450g",
    boxQty: 16,
    retailPrice: add20Percent(2.13),
    boxPrice: add10Percent(34.08),
    image: "/products/NUTS/BIG NUTS/GREEN RAISINS.jpg",
  },
  {
    name: "Aytac Turkish Sultana",
    size: "450g",
    boxQty: 16,
    retailPrice: add20Percent(2.15),
    boxPrice: add10Percent(34.40),
    image: "/products/NUTS/BIG NUTS/TURKISH SULTANA.jpg",
  },
  {
    name: "Aytac Royal Nut Mix",
    size: "450g",
    boxQty: 14,
    retailPrice: add20Percent(2.13),
    boxPrice: add10Percent(29.82),
    image: "/products/NUTS/BIG NUTS/ROYAL MIX NUT.jpg",
  },
  {
    name: "Aytac Luxury Nut Mix",
    size: "450g",
    boxQty: 14,
    retailPrice: add20Percent(5.05),
    boxPrice: add10Percent(70.70),
    image: "/products/NUTS/BIG NUTS/LUXURY MIX NUT.jpg",
  },
  {
    name: "Aytac Sultanas",
    size: "450g",
    boxQty: 16,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(22.72),
    image: "/products/NUTS/BIG NUTS/SULTANA.jpg",
  },
  {
    name: "Aytac Festive Mix",
    size: "450g",
    boxQty: 14,
    retailPrice: add20Percent(2.13),
    boxPrice: add10Percent(29.82),
    image: "/products/NUTS/BIG NUTS/FESTIVE MIX.jpg",
  },
  {
    name: "Aytac Golden Sultana",
    size: "425g",
    boxQty: 16,
    retailPrice: add20Percent(2.13),
    boxPrice: add10Percent(34.08),
    image: "/products/NUTS/BIG NUTS/GOLDEN SULTANA.jpg",
  },
  {
    name: "Aytac Raw Almond",
    size: "400g",
    boxQty: 16,
    retailPrice: add20Percent(3.56),
    boxPrice: add10Percent(56.96),
    image: "/products/NUTS/BIG NUTS/ALMOND RAW.jpg",
  },
  {
    name: "Aytac Raw Cashew",
    size: "400g",
    boxQty: 14,
    retailPrice: add20Percent(3.56),
    boxPrice: add10Percent(49.84),
    image: "/products/NUTS/BIG NUTS/CASHEW RAW.jpg",
  },
  {
    name: "Aytac Salted Pistachio",
    size: "400g",
    boxQty: 12,
    retailPrice: add20Percent(5.70),
    boxPrice: add10Percent(68.40),
    image: "/products/NUTS/BIG NUTS/PISTACHIO SALTED.jpg",
  },
  {
    name: "Aytac Raw Pistachio In Shell",
    size: "400g",
    boxQty: 12,
    retailPrice: add20Percent(4.99),
    boxPrice: add10Percent(59.88),
    image: "/products/NUTS/BIG NUTS/RAW PISTACHIO IN SHELL.jpg",
  },
  {
    name: "Aytac Fruit & Nut Mix",
    size: "400g",
    boxQty: 16,
    retailPrice: add20Percent(2.85),
    boxPrice: add10Percent(45.60),
    image: "/products/NUTS/BIG NUTS/FRUIT & NUT MIX.jpg",
  },
  {
    name: "Aytac Roasted Chana With Skin",
    size: "400g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/ROASTED CHANA WITH SKIN.jpg",
  },
  {
    name: "Aytac Pistachio Mix",
    size: "400g",
    boxQty: 14,
    retailPrice: add20Percent(6.42),
    boxPrice: add10Percent(89.88),
    image: "/products/NUTS/BIG NUTS/PISTACHIO MIX.jpg",
  },
  {
    name: "Aytac Salted Cashews",
    size: "400g",
    boxQty: 14,
    retailPrice: add20Percent(4.99),
    boxPrice: add10Percent(69.86),
    image: "/products/NUTS/BIG NUTS/SALTED CASHEWS.jpg",
  },
  {
    name: "Aytac Salted Almonds",
    size: "400g",
    boxQty: 14,
    retailPrice: add20Percent(4.70),
    boxPrice: add10Percent(65.80),
    image: "/products/NUTS/BIG NUTS/SALTED ALMONDS.jpg",
  },
  {
    name: "Aytac Roasted Blanched Chana",
    size: "375g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/ROASTED BLANCHED CHANA.jpg",
  },
  {
    name: "Aytac Hazelnut With Skin",
    size: "350g",
    boxQty: 14,
    retailPrice: add20Percent(5.70),
    boxPrice: add10Percent(79.80),
    image: "/products/NUTS/BIG NUTS/HAZELNUT WITH SKIN.jpg",
  },
  {
    name: "Aytac Hazelnut Blanched",
    size: "350g",
    boxQty: 14,
    retailPrice: add20Percent(7.13),
    boxPrice: add10Percent(99.82),
    image: "/products/NUTS/BIG NUTS/HAZELNUT BLANCHED.jpg",
  },
  {
    name: "Aytac Salted Corn",
    size: "350g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/CORN SALTED.jpg",
  },
  {
    name: "Aytac Bbq Corn",
    size: "325g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/BBQ CORN.jpg",
  },
  {
    name: "Aytac Spicy Corn",
    size: "325g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/SPICY CORN.jpg",
  },
  {
    name: "Aytac Lemon Chilli Corn",
    size: "325g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/LEMON & CHILLI CORN.jpg",
  },
  {
    name: "Aytac Pistachio Kernel",
    size: "325g",
    boxQty: 16,
    retailPrice: add20Percent(7.25),
    boxPrice: add10Percent(116.00),
    image: "/products/NUTS/BIG NUTS/PISTACHIO KERNEL.jpg",
  },
  {
    name: "Aytac Walnut",
    size: "325g",
    boxQty: 12,
    retailPrice: add20Percent(3.56),
    boxPrice: add10Percent(42.72),
    image: "/products/NUTS/BIG NUTS/WALNUT.jpg",
  },
  {
    name: "Aytac Turkish Pistachio",
    size: "320g",
    boxQty: 14,
    retailPrice: add20Percent(7.13),
    boxPrice: add10Percent(99.82),
    image: "/products/NUTS/BIG NUTS/TURKISH PISTACHIO.jpg",
  },
  {
    name: "Aytac Desiccated Coconut Medium",
    size: "300g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/DESICCATED COCONUT MEDIUM.jpg",
  },
  {
    name: "Aytac Desiccated Coconut Fine",
    size: "300g",
    boxQty: 14,
    retailPrice: add20Percent(1.42),
    boxPrice: add10Percent(19.88),
    image: "/products/NUTS/BIG NUTS/DESICCATED COCONUT FINE.jpg",
  },
  {
    name: "Aytac Bombay Mix",
    size: "300g",
    boxQty: 16,
    retailPrice: add20Percent(1.77),
    boxPrice: add10Percent(28.32),
    image: "/products/NUTS/BIG NUTS/BOMBAY MIX.jpg",
  },
  {
    name: "Aytac Raw Monkey Nut",
    size: "250g",
    boxQty: 12,
    retailPrice: add20Percent(0.71),
    boxPrice: add10Percent(8.52),
    image: "/products/NUTS/BIG NUTS/RAW MONKEY NUTS.jpg",
  },
];

export async function GET() {
  try {
    const products = readProducts();

    let addedProducts = 0;
    let updatedVariants = 0;

    for (const item of bigNutProducts) {
      const slug = makeSlug(item.name);

      const existingProductIndex = products.findIndex(
        (p) => makeSlug(p.slug) === slug || makeSlug(p.name) === slug
      );

      const variant: ProductVariant = {
        size: item.size,
        retailPrice: item.retailPrice,
        retailDiscountPrice: "",
        boxQty: item.boxQty,
        boxPrice: item.boxPrice,
        boxDiscountPrice: "",
        image: item.image,
      };

      if (existingProductIndex === -1) {
        products.push({
          slug,
          name: item.name,
          category: "Kuruyemis",
          subCategory: "Big Nut",
          description: "",
          variants: [variant],
        });
        addedProducts += 1;
      } else {
        const existingVariantIndex = products[existingProductIndex].variants.findIndex(
          (v) => String(v.size).toLowerCase() === String(item.size).toLowerCase()
        );

        if (existingVariantIndex === -1) {
          products[existingProductIndex].variants.push(variant);
          updatedVariants += 1;
        } else {
          products[existingProductIndex].variants[existingVariantIndex] = variant;
          updatedVariants += 1;
        }

        products[existingProductIndex].category = "Kuruyemis";
        products[existingProductIndex].subCategory = "Big Nut";
      }
    }

    writeProducts(products);

    return NextResponse.json({
      success: true,
      message: "Big Nut products imported successfully.",
      addedProducts,
      updatedVariants,
      totalBigNutItems: bigNutProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Big Nut import failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}