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

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const products = readProducts();

  const slugMap: Record<string, { by: "subCategory" | "category"; value: string }> = {
    pulses: { by: "subCategory", value: "Pulses" },
    rice: { by: "subCategory", value: "Rice" },
    "seeds-superfoods": { by: "subCategory", value: "Seeds & Superfoods" },
    "flour-oats": { by: "subCategory", value: "Flour-Oats" },
    "big-nuts": { by: "subCategory", value: "Big Nut" },
    "small-nuts": { by: "subCategory", value: "Small Nut" },
    jellybon: { by: "category", value: "Jellybon" },
  };

  const rule = slugMap[slug];

  const filteredProducts = products.filter((product) => {
    if (!rule) return false;
    if (rule.by === "category") return product.category === rule.value;
    return product.subCategory === rule.value;
  });

  const title = rule?.value || "Category";

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-7xl">
        <a
          href="/"
          className="mb-6 inline-block rounded border border-[#102418] px-4 py-2 text-sm font-semibold text-[#102418]"
        >
          ← Back to Home
        </a>

        <h1 className="mb-8 text-4xl font-bold">{title}</h1>

        {filteredProducts.length === 0 ? (
          <p className="text-lg">No products found in this category yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const variants = product.variants || [];
              const mainVariant =
                variants.find((v) => (v.size || "").toLowerCase() === "1kg") ||
                variants[0];

              const productHref = `/products/${makeSlug(product.slug || product.name || "")}`;

              return (
                <a
                  key={productHref}
                  href={productHref}
                  className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-lg"
                >
                  <div className="mb-4 h-52 overflow-hidden rounded bg-[#f3efe5]">
                    {mainVariant?.image ? (
                      <img
                        src={mainVariant.image}
                        alt={product.name || ""}
                        className="h-full w-full object-contain"
                      />
                    ) : null}
                  </div>

                  <h2 className="text-lg font-bold">{product.name}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {product.category} / {product.subCategory}
                  </p>

                  <div className="mt-3 text-sm text-gray-700">
                    {variants.map((variant) => {
                      const shown =
                        variant.retailDiscountPrice ||
                        variant.retailPrice ||
                        variant.discountPrice ||
                        variant.unitPrice ||
                        "";

                      return (
                        <div key={variant.size}>
                          {variant.size || "-"} — {shown ? `£${shown}` : "-"}
                        </div>
                      );
                    })}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}